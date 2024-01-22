import { ConsoleStyle } from "./ConsoleLogger";

export class BasicLogStyle    implements ConsoleStyle { bgColor = '#000'; underline = false; bold = true; fgColor = '#FFFFFF' }
export class BasicLogErrStyle implements ConsoleStyle { bgColor = '#000'; underline = false; bold = true; fgColor = '#FFFFFF' }
export class BoldLogBG        implements ConsoleStyle { bgColor = '#FFF'; underline = false; bold = true; fgColor = '#000' }
export class BoldErrBG        implements ConsoleStyle { bgColor = '#EBC3C3'; underline = false; bold = true; fgColor = '#E9A783' }

export class BasicUnderline implements ConsoleStyle { bgColor = '#000'; underline = true; bold = true; fgColor = '#FFFFFF' }
export class BasicDashed implements ConsoleStyle { bgColor = '#000'; underline = false; bold = true; fgColor = '#FFFFFF';  dashedBox= true }
export class ErrDashed implements ConsoleStyle { bgColor = '#000'; underline = false; bold = true; fgColor = '#BB1A1A';  dashedBox= true }


export class PrimaryColor implements ConsoleStyle {fgColor = '#0d6efd' }
export class SuccessColor implements ConsoleStyle {fgColor = '#198754   ' }
export class WarningColor implements ConsoleStyle {fgColor = '#ffc107' }
export class InfoColor implements ConsoleStyle {fgColor = '#0dcaf0' }

export class TealColor implements ConsoleStyle {fgColor = '#20c997' }
export class OrangeColor implements ConsoleStyle {fgColor = '#fd7e14' }
export class IndigoColor implements ConsoleStyle {fgColor = '#6610f2' }