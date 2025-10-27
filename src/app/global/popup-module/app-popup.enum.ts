export enum ACTION_ENUM {
  ADD = "Add",
  UPDATE = "Update",
  SHOW = "Show",
  DELETE = "Delete",
  REFRESH = "refresh",
};

export enum ASIDE_CLASS {
  LEFT = 'modal-left',
  RIGHT = 'modal-right',
  BOTTOM = 'modal-bottom',
  TOP = 'modal-top',
  CENTER = 'modal-center',
  TOP_RIGHT = 'modal-top modal-right border m-4',
  BOTTOM_RIGHT = 'modal-right modal-bottom setting',//'modal-bottom modal-right border m-4',
  BOTTOM_LEFT = 'modal-bottom modal-left border m-4',
};

export enum ASIDE_SIZE {
  W_NONE = '',
  W_25 = 'w-25',
  W_50 = 'w-50',
  W_75 = 'w-75',
  W_100 = 'w-100',
  LARGE = 'modal-lg',
  W_XL = 'w-xl',
  H_85 = 'h-85',
  H_100 = 'h-100'
};


export enum STATUS_ENUM { ACTIVE = 1, INACTIVE = 2 };

export class PopoverPlacement {
  public static readonly Bottom = 'bottom';
  public static readonly BottomLeft = 'bottom-left';
  public static readonly BottomRight = 'bottom-right';
  public static readonly Left = 'left';
  public static readonly Right = 'right';
  public static readonly Top = 'top';
  public static readonly TopLeft = 'top-left';
  public static readonly TopRight = 'top-right';
}
