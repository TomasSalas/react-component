import * as React from "react";

export interface AccordionItem {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items?: AccordionItem[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (openKeys: string[]) => void;
  allowMultiple?: boolean;
  variant?: "primary" | "success" | "warning" | "error";
  className?: string;
}

export declare const Accordion: React.ComponentType<AccordionProps>;

export type AlertPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";
export type AlertVariant =
  | "success"
  | "error"
  | "warning"
  | "primary";

export interface AlertOptions {
  title?: string;
  subtitle?: string;
  message?: string;
  variant?: AlertVariant;
  duration?: number;
  position?: AlertPosition;
  closable?: boolean;
  icon?: React.ReactNode;
}

export type ViewMode = 'date' | 'month' | 'year';

export interface CalendarState {
  selectedDate: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoveredDate: Date | null;
  disabledDates: Date[];
}

export interface CalendarHandlers {
  onDateSelect: (e: React.MouseEvent<HTMLButtonElement>, date: Date) => void;
  onHover: (date: Date | null) => void;
  onTimeSelect: (unit: 'hour' | 'minute', val: number, side: 'start' | 'end') => void;
}

export interface TimePanelProps {
  date: Date | null;
  onTimeSelect: (unit: 'hour' | 'minute', val: number, type: 'start' | 'end') => void;
  activeVariant: string;
  type?: 'start' | 'end';
  open: boolean;
}

export declare const TimePanel: React.ComponentType<TimePanelProps>;


export interface YearPanelProps {
  viewDate: Date;
  onSelect: (year: number) => void;
  activeVariant: string;
}

export declare const YearPanel: React.ComponentType<YearPanelProps>;


export interface MonthPanelProps {
  viewDate: Date;
  onSelect: (monthIndex: number) => void;
  activeVariant: string;
}

export declare const MonthPanel: React.ComponentType<MonthPanelProps>;


export interface DatePanelProps {
  panelDate: Date;
  state: CalendarState;
  handlers: CalendarHandlers;
  activeVariant: string;
  range: boolean;
}

export declare const DatePanel: React.ComponentType<DatePanelProps>;


export interface CalendarHeaderProps {
  panelDate: Date;
  viewMode: ViewMode;
  onPrev: () => void;
  onNext: () => void;
  onSuperPrev: () => void;
  onSuperNext: () => void;
  onTitleClick: () => void;
  activeVariant: string;
}

export declare const CalendarHeader: React.ComponentType<CalendarHeaderProps>;


export interface CalendarPopupProps {
  range: boolean;
  showTime: boolean;
  open: boolean;
  activeVariant: string;
  state: CalendarState;
  handlers: CalendarHandlers;
}

export declare const CalendarPopup: React.ComponentType<CalendarPopupProps>;


export interface AlertInterface {
  (data: AlertOptions): number;
  success: (
    title: string,
    options?: Omit<AlertOptions, "title" | "variant">,
  ) => number;
  error: (
    title: string,
    options?: Omit<AlertOptions, "title" | "variant">,
  ) => number;
  warning: (
    title: string,
    options?: Omit<AlertOptions, "title" | "variant">,
  ) => number;
  primary: (
    title: string,
    options?: Omit<AlertOptions, "title" | "variant">,
  ) => number;
  dismiss: (id?: number) => void;
}

export declare const alert: AlertInterface;

export interface AlertContainerProps {
  position?: AlertPosition;
}

export declare const AlertContainer: React.ComponentType<AlertContainerProps>;

export interface AutoCompleteOption {
  value: string | number | null;
  label: string;
  group?: string;
}

export interface AutoCompleteHandle {
  focus: () => void;
  getValue: () => AutoCompleteOption | AutoCompleteOption[] | null;
}

export interface AutoCompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "size" | "onBlur"
> {
  value?: AutoCompleteOption | AutoCompleteOption[] | null;
  defaultValue?: AutoCompleteOption | AutoCompleteOption[] | null;
  onChange?: (value: any) => void;
  options?: AutoCompleteOption[];
  placeholder?: string;
  noOptionsText?: string;
  className?: string;
  variant?:
    | "primary"
    | "success"
    | "warning"
    | "error";
  size?: "small" | "medium" | "large";
  multiSelect?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  colorMessage?: string;
  name?: string;
  onBlur?: (e: any) => void;
  label?: string;
  fullWidth?: boolean;
  freeSolo?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactElement;
  maxVisibleChips?: number;
}

export declare const AutoComplete: React.ForwardRefExoticComponent<
  AutoCompleteProps & React.RefAttributes<AutoCompleteHandle>
>;

export interface BreadCrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadCrumbsProps {
  items?: BreadCrumbItem[];
  separator?: React.ReactNode;
  homeIcon?: React.ReactNode;
  className?: string;
  variant?: "primary";
  linkComponent?: React.ElementType;
}

export declare const BreadCrumbs: React.ComponentType<BreadCrumbsProps>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "success"
    | "error"
    | "warning"
    | "ghost"
    | "link";
  size?: "small" | "medium" | "large";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  ariaLabel?: string;
  fontWeight?: "light" | "normal" | "medium" | "bold" | "semibold";
  textStyle?: "truncate" | "normal" | "nowrap";
  className?: string;
}

export declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;

export interface ButtonDropdownProps {
  trigger: React.ReactElement;
  children: React.ReactNode | React.ReactNode[];
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export declare const ButtonDropdown: React.ComponentType<ButtonDropdownProps>;

export type ChartType = "bar" | "line" | "pie" | "donut";

export interface ChartSeries {
  key: string;
  name: string;
}

export interface ChartDataPoint {
  label: string;
  value?: number;
  color?: string;
  [seriesKey: string]: any;
}

export interface ChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  type?: ChartType;
  data?: ChartDataPoint[];
  series?: ChartSeries[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  valueFormatter?: (value: number) => string;
  title?: string;
  className?: string;
}

export declare const CHART_COLORS: string[];

export declare const Chart: React.ForwardRefExoticComponent<
  ChartProps & React.RefAttributes<HTMLDivElement>
>;

export interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  labelPosition?: "left" | "right";
  checked?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  variant?:
    | "primary"
    | "success"
    | "error"
    | "warning";
  fullWidth?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export declare const CheckBox: React.ForwardRefExoticComponent<
  CheckBoxProps & React.RefAttributes<HTMLInputElement>
>;

export type ContainerElementType =
  | "div"
  | "section"
  | "article"
  | "main"
  | "aside"
  | "header"
  | "footer";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: ContainerElementType;
  maxWidth?: "sx" | "sm" | "md" | "lg" | "xl" | "2xl" | "fullWidth";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  padding?: "0" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export declare const Container: React.ForwardRefExoticComponent<
  ContainerProps & React.RefAttributes<HTMLElement>
>;

export interface DatePickerProps {
  value?: string | string[] | null;
  onChange?: (value: any) => void;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  range?: boolean;
  rangeDays?: number | null;
  size?: "small" | "medium" | "large";
  variant?:
    | "primary"
    | "success"
    | "error"
    | "warning";
  disabledDates?: string[];
  label?: string;
  disabled?: boolean;
  showTime?: boolean;
  fullWidth?: boolean;
}

export declare const DatePicker: React.ForwardRefExoticComponent<
  DatePickerProps & React.RefAttributes<HTMLDivElement>
>;

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  closeOnOverlayClick?: boolean;
  overflowY?: boolean;
  className?: string;
}

export declare const Drawer: React.ComponentType<DrawerProps>;

export interface FileUploadHandle {
  open: () => void;
  clear: () => void;
}

export interface FileUploadProps {
  label?: string;
  onFilesSelect?: (files: File[]) => void;
  multiple?: boolean;
  placeholder?: string;
  accept?: string;
  className?: string;
  variant?:
    | "primary"
    | "success"
    | "warning"
    | "error";
  disabled?: boolean;
  errorMessage?: string;
}

export declare const FileUpload: React.ForwardRefExoticComponent<
  FileUploadProps & React.RefAttributes<FileUploadHandle>
>;

export interface InputTextProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "variant"
> {
  label?: string;
  variant?:
    | "primary"
    | "success"
    | "warning"
    | "error";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  errorMessage?: string;
  iconLeft?: React.ReactElement;
  iconRight?: React.ReactElement;
  isClearable?: boolean;
  className?: string;
}

export declare const InputText: React.ForwardRefExoticComponent<
  InputTextProps & React.RefAttributes<HTMLInputElement>
>;

export interface InputRichTextProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "value"
> {
  fullWidth?: boolean;
  className?: string;
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  minHeight?: string;
  maxHeight?: string;
  variant?:
    | "primary"
    | "success"
    | "error"
    | "warning"
    | "ghost"
    | "link";
  disabled?: boolean;
}

export declare const InputRichText: React.ForwardRefExoticComponent<
  InputRichTextProps & React.RefAttributes<HTMLDivElement>
>;

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  closeOnOverlayClick?: boolean;
  variant?:
    | "primary"
    | "success"
    | "error"
    | "warning";
  className?: string;
  overflowY?: boolean;
}

export declare const Modal: React.ForwardRefExoticComponent<
  ModalProps & React.RefAttributes<HTMLDivElement>
>;

export interface SelectOption {
  value: any;
  label: string;
  group?: string;
}

export interface SelectHandle {
  focus: () => void;
  getValue: () => any;
}

export interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "value" | "defaultValue" | "onChange" | "onBlur"
> {
  value?: any;
  onChange?: (e: { target: { name: string; value: any }; value: any }) => void;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  variant?:
    | "primary"
    | "success"
    | "error"
    | "warning";
  size?: "small" | "medium" | "large";
  multiSelect?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  name?: string;
  onBlur?: (e: { target: { name: string; value: any } }) => void;
  label?: string;
  fullWidth?: boolean;
  loading?: boolean;
  defaultValue?: any;
  iconLeft?: React.ReactElement;
}

export declare const Select: React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<SelectHandle>
>;

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  wrapText?: boolean;
  maxWidth?: string | number;
  render?: (value: any, row: any) => React.ReactNode;
  renderHeader?: (column: TableColumn) => React.ReactNode;
}

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: TableColumn[];
  data?: any[];
  actions?: ((row: any) => React.ReactNode) | null;
  onRowClick?: ((row: any) => void) | null;
  onSortChange?: ((columnKey: string) => void) | null;
  caption?: string;
  tableClassName?: string;
  rowClassName?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  currentPage?: number;
  rowsPerPage?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (direction: any) => void;
  onRowsPerPageChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  size?: "sm" | "md" | "lg";
  titleNoData?: string;
  subTitleNoData?: string;
  disablePagination?: boolean;
  heightVh?: number | string;
  loadingInfo?: boolean;
  textLoading?: string;
  variant?:
    | "primary"
    | "success"
    | "error"
    | "warning"
    | "ghost";
  boldHeaders?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  fullWidth?: boolean;
}

export declare const Table: React.ForwardRefExoticComponent<
  TableProps & React.RefAttributes<HTMLDivElement>
>;

export type ToastVariant = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface ToastInterface {
  push: (
    title: string,
    subtitle?: string,
    variant?: ToastVariant,
    duration?: number,
  ) => number;
  success: (title: string, subtitle?: string, duration?: number) => number;
  error: (title: string, subtitle?: string, duration?: number) => number;
  info: (title: string, subtitle?: string, duration?: number) => number;
  warning: (title: string, subtitle?: string, duration?: number) => number;
  dismiss: (id: number) => void;
}

export declare const toast: ToastInterface;

export interface ToasterProps {
  position?: ToastPosition;
}

export declare const Toaster: React.ComponentType<ToasterProps>;

export interface ToggleProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "variant" | "size"
> {
  label?: React.ReactNode;
  labelPosition?: "left" | "right";
  checked?: boolean;
  errorMessage?: string;
  variant?:
    | "primary"
    | "success"
    | "error"
    | "warning";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export declare const Toggle: React.ForwardRefExoticComponent<
  ToggleProps & React.RefAttributes<HTMLInputElement>
>;

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  variant?:
    | "light"
    | "dark"
    | "primary"
    | "success"
    | "error"
    | "warning";
  delay?: number;
  nowrap?: boolean;
  className?: string;
}

export declare const Tooltip: React.ComponentType<TooltipProps>;

export interface TabItem {
  key: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items?: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  variant?: "primary" | "success" | "warning" | "error";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  className?: string;
}

export declare const Tabs: React.ComponentType<TabsProps>;