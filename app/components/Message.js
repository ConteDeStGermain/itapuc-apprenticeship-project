import React from 'react';

import '../CSS/message.css';

const Message = ({ text, isSent }) => {
  return (
    <div className={isSent ? 'sentMsg' : 'receivedMsg'}> 
      { text }
    </div>
  );
}

export default Message;