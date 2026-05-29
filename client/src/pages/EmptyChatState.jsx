import React from "react";

const EmptyChatState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 bg-slate-900/10 rounded-2xl border border-dashed border-gray-800">
      <p className="text-lg font-semibold">No Conversation Selected</p>
      <p className="text-sm text-gray-500">Pick an active card out of your sidebar list to begin</p>
    </div>
  );
};

export default EmptyChatState;