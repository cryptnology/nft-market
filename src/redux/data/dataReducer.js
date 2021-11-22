const initialState = {
  loading: false,
  allMarketItems: null,
  marketItemsPurchased: null,
  marketItemsCreated: null,
  error: false,
  errorMsg: '',
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHECK_DATA_REQUEST':
      return {
        ...initialState,
        loading: true,
      };
    case 'CHECK_DATA_SUCCESS':
      return {
        ...initialState,
        loading: false,
        allMarketItems: action.payload.allMarketItems,
        marketItemsPurchased: action.payload.marketItemsPurchased,
        marketItemsCreated: action.payload.marketItemsCreated,
        marketItemsCancelled: action.payload.marketItemsCancelled,
      };
    case 'CHECK_DATA_FAILED':
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
