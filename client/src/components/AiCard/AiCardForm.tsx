import { useState } from 'react';

interface IAiCardForm {
  presetKey: string; // sevenDayPlan
  title: string; // "Путь к цели от МарИИи"
  placeholder: string; // "Опишите свою цель"
  buttonText: string; // "УКАЗАТЬ ЦЕЛЬ"
  onSubmitted: (text: string) => void;
}

const AiCardForm = (props: IAiCardForm) => {
  const { presetKey, title, placeholder, buttonText, onSubmitted } = props;
  const [inputValue, setInputValue] = useState('');
  //const { mutate, isRefresh } = useCreateAiJob();
  const handleClick = () => {
    const text = inputValue.trim();
    if (!text) return;
    onSubmitted(text);
    setInputValue('');
  };
  return (
    <>
      <section className="rounded-[15px] border border-white p-5 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]">
        <h3 className="font-ars mb-4 text-2xl">{title}</h3>

        {/* textarea */}
        <label className="mb-4 block">
          <span className="sr-only">{placeholder}</span>
          <textarea
            id={presetKey}
            value={inputValue}
            onChange={(newValue) => {
              setInputValue(newValue.target.value);
            }}
            rows={3}
            placeholder={placeholder}
            className="border-navy caret-navy w-full resize-none rounded-[14px] border bg-white p-4 text-[15px] leading-6 transition outline-none placeholder:opacity-100 placeholder:transition focus:placeholder:opacity-0"
          />
        </label>

        {/* actions */}

        <button onClick={handleClick} type="button" className="btn">
          {buttonText}
        </button>
      </section>
    </>
  );
};

export default AiCardForm;
