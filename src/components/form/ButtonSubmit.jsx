const SubmitButton = ({ text, disabled }) => {
  return (
    <button
      className="btn-pill w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      type="submit"
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default SubmitButton;
