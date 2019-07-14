import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Program } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

import { isReturnBlockStatement } from "~src/analyzers//utils/is_return_block_statement";
import { isReturnStatementWithValue } from "~src/analyzers//utils/is_return_statement_with_value";
import { AnalyzerImpl } from "~src/analyzers/AnalyzerImpl";
import { extractExport } from "~src/analyzers/utils/extract_export";
import { extractMainMethod, MainMethod } from "~src/analyzers/utils/extract_main_method";
import { parameterName } from '~src/analyzers/utils/extract_parameter';
import { findTopLevelConstants } from "~src/analyzers/utils/find_top_level_constants";
import { isCallExpression } from "~src/analyzers/utils/is_call_expression";
import { isIdentifier } from "~src/analyzers/utils/is_identifier";
import { annotateType } from "~src/analyzers/utils/type_annotations";
import { factory } from "~src/comments/comment";
import { NO_METHOD, NO_NAMED_EXPORT, NO_PARAMETER, UNEXPECTED_SPLAT_ARGS } from "~src/comments/shared";
import { AstParser } from "~src/parsers/AstParser";

const TIP_EXPORT_INLINE = factory`
Did you know that you can export functions, classes and constants directly
inline?
`('javascript.resistor-color-duo.export_inline')

const Parser: AstParser = new AstParser(undefined, 1)

const NOT_FOUND = {} as const

export class ResistorColorDuoAnalyzer extends AnalyzerImpl {

  private program!: Program
  private source!: string

  private _mainMethod!: ReturnType<typeof extractMainMethod>
  private _mainConstants!: ReturnType<typeof findTopLevelConstants>
  private _mainExport!: ReturnType<typeof extractExport>

  private get mainMethod(): ReturnType<typeof extractMainMethod> {
    if (!this._mainMethod) {
      this._mainMethod = extractMainMethod(this.program, 'value')
    }
    return this._mainMethod
  }

  private get mainExport(): ReturnType<typeof extractExport> {
    if (!this._mainExport) {
      this._mainExport = extractExport(this.program, 'value')
    }
    return this._mainExport
  }

  private get mainConstants(): ReturnType<typeof findTopLevelConstants> {
    if (!this._mainConstants) {
      this._mainConstants = findTopLevelConstants(this.program, ['let', 'const', 'var'])
    }
    return this._mainConstants
  }

  public async execute(input: Input): Promise<void> {
    const [parsed] = await Parser.parse(input)

    this.program = parsed.program
    this.source = parsed.source

    // Firstly we want to check that the structure of this solution is correct
    // and that there is nothing structural stopping it from passing the tests
    this.checkStructure()

    // Now we want to ensure that the method signature is sane and that it has
    // valid arguments
    this.checkSignature()

    // There are a handful optimal solutions for resistor-color-duo which needs
    // no comments and can just be approved. If we have it, then let's just
    // acknowledge it and get out of here.
    this.checkForOptimalSolutions()

    // The solution is automatically referred to the mentor if it reaches this
  }

  private checkStructure(): void | never {
    const method = this.mainMethod
    const [functionDeclaration,] = this.mainExport

    // First we check that there is a value function and that this function
    // is exported.
    if (!method) {
      this.comment(NO_METHOD({ 'method.name': 'value' }))
    }

    if (!functionDeclaration) {
      this.comment(NO_NAMED_EXPORT({ 'export.name': 'value' }))
    }

    if (this.hasCommentary) {
      this.disapprove()
    }
  }

  private checkSignature(): void | never {
    const method: MainMethod = this.mainMethod!

    // If there is no parameter
    // then this solution won't pass the tests.
    if (method.params.length === 0) {
      this.disapprove(NO_PARAMETER({ 'function.name': method.id!.name }))
    }

    const firstParameter = method.params[0]

    // If they provide a splat, the tests can pass but we should suggest they
    // use a real parameter.
    if (firstParameter.type === AST_NODE_TYPES.RestElement) {
      const splatArgName = parameterName(firstParameter)
      const splatArgType = annotateType(firstParameter.typeAnnotation)

      this.disapprove(UNEXPECTED_SPLAT_ARGS({
        'splat-arg.name': splatArgName,
        'parameter.type': splatArgType
      }))
    }
  }

  private checkForOptimalSolutions(): void | never {
    // There are two optimal solutions: either a map-join or a reduce.
    //
    // Other solutions might be approved but these are the only ones
    // that we would approve without comment.

    if (
      !this.isOptimalMapJoinImplementation()
      && !this.isOptimalReduceImplementation()
    ) {
      // continue analyzing
      this.logger.log('~> Solution is not optimal')
      return
    }

    this.checkForTips()
    this.approve()
  }

  private checkForTips(): void | never {
    if (!this.hasInlineExport()) {
      this.comment(TIP_EXPORT_INLINE())
    }
  }

  private isOptimalMapJoinImplementation(): boolean {
    // The optimal map-join solution looks like this:
    //
    // const COLORS = ['...', '...']
    //
    // function colorCode(color) {
    //   return COLORS.indexOf(color)
    // }
    //
    // export function value(colors) {
    //   return Number(colors.map(colorCode).join(''))
    // }
    //
    // The COLORS constant must be an Array and there must be a single call to
    // indexOf. Additionally, the colorCode function can not have a default
    // argument, or any other syntax, such as conditionals, re-assignment, and
    // so forth.
    //
    // The value function uses Number for conversion (not parseXXX), calls map
    // with a single argument (a function that calls `COLORS.indexOf`) and then
    // joins the values.

    if (!this.isUsingOptimalConstants()) {
      return false
    }

    return false  // still unimplemented
  }

  private isUsingOptimalConstants(): boolean {
    // An optimal solution will use a single array constant
    if (
      this.mainConstants
        .filter((c): boolean => c.init!.type === AST_NODE_TYPES.ArrayExpression)
        .length !== 1) {
      return false
    }

    // An optimal solution will only have constants that are arrays
    // or some kind of function expression
    const acceptableTypes = [
      AST_NODE_TYPES.ArrayExpression, 
      AST_NODE_TYPES.FunctionExpression, 
      AST_NODE_TYPES.ArrowFunctionExpression
    ]
    if (
      this.mainConstants
        .filter((c): boolean => !acceptableTypes.includes(c.init!.type))
        .length > 0) {
      return false
    }

    return true
  }

  private isOptimalReduceImplementation(): boolean {
    // The reduce variant looks like this, with the second argument to reduce
    // being optional.
    //
    // export function value(colors) {
    //   return colors
    //     .reverse()
    //     .reduce((value, color, i) => {
    //       return colorCode(color) * (10 ** i) + value
    //     }, 0)
    // }
    
    return false
  }

  private hasInlineExport(): boolean {
    // Additionally make sure the export is inline by checking if it doesn't
    // have any specifiers:
    //
    // export function value
    // => no specififers
    //
    // export { value }
    // => yes specififers
    //
    return this.mainExport[0]!.specifiers
      && this.mainExport[0]!.specifiers.length === 0
  }
}

