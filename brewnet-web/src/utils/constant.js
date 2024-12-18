// 권한
export const ROLE = {
  MASTER: 'ROLE_MASTER',
  GENERAL_ADMIN: 'ROLE_GENERAL_ADMIN',
  RESPONSIBLE_ADMIN: 'ROLE_RESPONSIBLE_ADMIN',
  FRANCHISE: 'ROLE_FRANCHISE',
  DELIVERY: 'ROLE_DELIVERY',
};
export const HEAD_QUARTER_ROLES = [ROLE.MASTER, ROLE.GENERAL_ADMIN, ROLE.RESPONSIBLE_ADMIN];
export const ALL_ROLES = [...HEAD_QUARTER_ROLES, ROLE.FRANCHISE, ROLE.DELIVERY];

// 직급
export const POSITION = {
  STAFF: 'STAFF',
  ASSISTANT_MANAGER: 'ASSISTANT_MANAGER',
  MANAGER: 'MANAGER',
  CEO: 'CEO',
};
export const POSITIONS = [POSITION.STAFF, POSITION.ASSISTANT_MANAGER, POSITION.MANAGER, POSITION.CEO];
export const APPROVAL_POSITIONS = [POSITION.ASSISTANT_MANAGER, POSITION.MANAGER, POSITION.CEO];

// 기안자의 주문/교환/반품 승인 여부
export const DRAFTER_APPROVED = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  NONE: 'NONE',
};

// 주문/교환/반품 전체 결재 상태
export const APPROVAL = {
  APPROVED: 'APPROVED',
  CANCELED: 'CANCELED',
  UNCONFIRMED: 'UNCONFIRMED',
  REJECTED: 'REJECTED',
};

export const EXCHANGE_REASON = {
  DAMAGED: 'DAMAGED',
  DEFECTIVE: 'DEFECTIVE',
  OTHER: 'OTHER',
};

// 교환 상태
export const EXCHANGE_STATUS = {
  REQUESTED: 'REQUESTED',
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PICKING: 'PICKING',
  PICKED: 'PICKED',
  SHIPPING: 'SHIPPING',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'COMPLETED',
};

// 발주 상태
export const PURCHASE_STATUS = {
  REQUESTED: 'REQUESTED',
  CANCELED: 'CANCELED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// 기안 종류
export const DRAFT_KIND = {
  PURCHASE: 'PURCHASE',
  ORDER: 'ORDER',
  EXCHANGE: 'EXCHANGE',
  RETURN: 'RETURN',
};

// 결재상태
export const APPROVAL_STATUS = {
  UNCONFIRMED: 'UNCONFIRMED',
  CANCELED: 'CANCELED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};
// 결재상태(배열)
export const APPROVAL_STATUS_LIST = [
  APPROVAL_STATUS.UNCONFIRMED,
  APPROVAL_STATUS.CANCELED,
  APPROVAL_STATUS.APPROVED,
  APPROVAL_STATUS.REJECTED,
];

// 결재자의 결재상태
export const APPROVER_APPROVED_STATUS = {
  UNCONFIRMED: 'UNCONFIRMED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

//
// 검색기준
//
export const SEARCH_CRITERIA = {
  ITEM_NAME: 'ITEM_NAME',
  ITEM_UNIQUE_CODE: 'ITEM_UNIQUE_CODE',
  CORRESPONDENT_NAME: 'CORRESPONDENT_NAME',
  CORRESPONDENT_CODE: 'CORRESPONDENT_CODE',
  STORAGE_NAME: 'STORAGE_NAME',
  STORAGE_CODE: 'STORAGE_CODE',
  ORDER_CODE: 'ORDER_CODE',
  ORDER_MANAGER: 'ORDER_MANAGER',
  ORDERED_FRANCHISE_NAME: 'ORDERED_FRANCHISE_NAME',
};
// 입고 확인 페이지 criteria
export const CRITERIA_IN_STOCK = [
  SEARCH_CRITERIA.ITEM_UNIQUE_CODE,
  SEARCH_CRITERIA.ITEM_NAME,
  SEARCH_CRITERIA.CORRESPONDENT_NAME,
  SEARCH_CRITERIA.STORAGE_NAME,
];
// 품목 목록 페이지 criteria
export const CRITERIA_ITEM_LIST = [SEARCH_CRITERIA.ITEM_NAME, SEARCH_CRITERIA.ITEM_UNIQUE_CODE];
// 거래처 목록 페이지 criteria
export const CRITERIA_CORRESPONDENT_LIST = [SEARCH_CRITERIA.CORRESPONDENT_CODE, SEARCH_CRITERIA.CORRESPONDENT_NAME];
// 거래처 취급품목 목록 페이지 criteria
export const CRITERIA_CORRESPONDENT_ITEM_LIST = [SEARCH_CRITERIA.ITEM_UNIQUE_CODE, SEARCH_CRITERIA.ITEM_NAME];
// 창고 목록 페이지 criteria
export const CRITERIA_STORAGE_LIST = [SEARCH_CRITERIA.STORAGE_CODE, SEARCH_CRITERIA.STORAGE_NAME];
// 본사 주문 목록 페이지 criteria
export const CRITERIA_HQ_ORDER_LIST = [
  SEARCH_CRITERIA.ORDER_CODE,
  SEARCH_CRITERIA.ORDERED_FRANCHISE_NAME,
  SEARCH_CRITERIA.ORDER_MANAGER,
];
// 가맹점 주문 목록 페이지 criteria
export const CRITERIA_FC_ORDER_LIST = [SEARCH_CRITERIA.ORDER_CODE, SEARCH_CRITERIA.ITEM_NAME];

// 주문 상태
export const ORDER_STATUS = {
  REQUESTED: 'REQUESTED',
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SHIPPING: 'SHIPPING',
  SHIPPED: 'SHIPPED',
};

// 반품 상태
export const RETURN_STATUS = {
  REQUESTED: 'REQUESTED',
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PICKING: 'PICKING',
  PICKED: 'PICKED',
  COMPLETED: 'COMPLETED',
};

// 주문 배송의 단계 목록
export const ORDER_DELIVERY_STEP_LIST = [ORDER_STATUS.APPROVED, ORDER_STATUS.SHIPPING, ORDER_STATUS.SHIPPED];
// 교환 배송의 단계 목록
export const EXCHANGE_DELIVERY_STEP_LIST = [
  EXCHANGE_STATUS.APPROVED,
  EXCHANGE_STATUS.PICKING,
  EXCHANGE_STATUS.PICKED,
  EXCHANGE_STATUS.SHIPPING,
  EXCHANGE_STATUS.SHIPPED,
];
// 반품 배송의 단계 목록
export const RETURN_DELIVERY_STEP_LIST = [RETURN_STATUS.APPROVED, RETURN_STATUS.PICKING, RETURN_STATUS.PICKED];

// 배송 상태
export const DELIVERY_STATUS = {
  START_PICK: 'START_PICK',
  PICKING: 'PICKING',
  PICKED: 'PICKED',
  START_DELIVERY: 'START_DELIVERY',
  SHIPPING: 'SHIPPING',
  SHIPPED: 'SHIPPED',
  APPROVED: 'APPROVED',
};

// 정렬 옵션
export const SORTING_OPTION = {
  DATE_ASC: 'dateASC',
  DATE_DESC: 'dateDESC',
  NAME_ASC: 'nameASC',
  NAME_DESC: 'nameDESC',
};
