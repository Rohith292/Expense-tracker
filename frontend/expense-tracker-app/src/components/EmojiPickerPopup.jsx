import React, { useState } from 'react'
import EmojiPicker from "emoji-picker-react"
import { LuImage, LuX } from 'react-icons/lu'

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col md:flex-row items-start gap-5 my-6 relative'>
      {/* Trigger icon and label */}
      <div 
        className='flex items-center gap-4 cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <div className='w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg'>
          {icon ? (
            <img src={icon} alt='icon' className='w-12 h-12 object-contain' />
          ) : (
            <LuImage />
          )}
        </div>

        <p>{icon ? "Change Icon" : "Pick Icon"}</p>
      </div>

      {/* Emoji Picker Popup */}
      {isOpen && (
        <div className='absolute top-16 z-50 shadow-lg'>
          {/* Close Button */}
          <div 
            className='w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-3 -right-3 cursor-pointer'
            onClick={() => setIsOpen(false)}
          >
            <LuX className='text-gray-600' />
          </div>

          {/* Emoji Picker */}
          <EmojiPicker 
            onEmojiClick={(emoji) => {
              onSelect(emoji.imageUrl || "");
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiPickerPopup;
