import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

const HistoryPanel = () => {
  const past = useSelector(state => state.flow.past);
  const future = useSelector(state => state.flow.future);
  const dispatch = useDispatch();

  return (
    <div className="absolute top-16 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 w-64 z-20">
      <h3 className="text-lg font-semibold text-white mb-4">History</h3>
      <div className="flex flex-col space-y-2">
        {past.slice().reverse().map((state, index) => (
          <button
            key={`past-${past.length - 1 - index}`}
            onClick={() => dispatch(ActionCreators.jumpToPast(past.length - 1 - index))}
            className="text-left text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-colors duration-150"
          >
            {`Action ${past.length - index}`}
          </button>
        ))}
        <div className="text-blue-400 font-semibold p-2 bg-gray-700 rounded-md">Current State</div>
        {future.map((state, index) => (
          <button
            key={`future-${index}`}
            onClick={() => dispatch(ActionCreators.jumpToFuture(index))}
            className="text-left text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-colors duration-150"
          >
            {`Future Action ${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
