import React from 'react';

import Fav from '../assets/favicon.png';

const MessageBubble = ({ message, isSender }) => (
  <div className={`message-row ${isSender ? 'sender' : 'receiver'}`}>  
  {!isSender && <img src={Fav} alt="themchar ai" width="33px"/>}
    <div className="message-bubble">
      {message.text}
    </div>
    
  </div>
);

export default MessageBubble;