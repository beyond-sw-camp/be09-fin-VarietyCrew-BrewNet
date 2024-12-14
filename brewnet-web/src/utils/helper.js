import {
  APPROVAL_STATUS,
  EXCHANGE_STATUS,
  ORDER_STATUS,
  PURCHASE_STATUS,
  RETURN_STATUS,
  DRAFTER_APPROVED,
} from './constant';

// 프라임뷰에 사용될 데이터
export const makeSelectOption = (label = '', value = '') => {
  return { label, value };
};
export const makeGroupSelectOption = (label = '', value = '', items = []) => {
  return { label, value, items };
};
export const makeRadioOption = (label = '', value = '', inputId = '') => ({ label, value, inputId });
export const makeAutocompleteSuggestion = (code, label) => ({ code, label });
export const makeTabs = (label = '', value = '') => ({ label, value });

// status에 따른 severity
export const getPurchaseStatusSeverity = purchaseStatus => {
  switch (purchaseStatus) {
    case PURCHASE_STATUS.REQUESTED:
      return 'success';

    case PURCHASE_STATUS.CANCELED:
    case PURCHASE_STATUS.REJECTED:
      return 'danger';

    case PURCHASE_STATUS.APPROVED:
      return 'info';

    default:
      return 'info';
  }
};

export const getApprovalStatusSeverity = status => {
  switch (status) {
    case APPROVAL_STATUS.UNCONFIRMED:
      return 'success';

    case APPROVAL_STATUS.REJECTED:
      return 'danger';

    case APPROVAL_STATUS.APPROVED:
      return 'info';

    default:
      return 'secondary';
  }
};

export const getOrderStatusSeverity = orderStatus => {
  switch (orderStatus) {
    case ORDER_STATUS.REQUESTED:
      return 'success';

    case ORDER_STATUS.CANCELED:
    case ORDER_STATUS.REJECTED:
      return 'danger';

    case ORDER_STATUS.APPROVED:
    case ORDER_STATUS.SHIPPING:
    case ORDER_STATUS.SHIPPED:
    case ORDER_STATUS.PENDING:
      return 'info';

    default:
      return 'info';
  }
};

export const getDrafterApprovedStatusSeverity = drafterApproved => {
  switch (drafterApproved) {
    case DRAFTER_APPROVED.APPROVE:
      return 'success';

    case DRAFTER_APPROVED.REJECT:
      return 'danger';

    case DRAFTER_APPROVED.NONE:
      return 'info';

    default:
      return 'info';
  }
};
