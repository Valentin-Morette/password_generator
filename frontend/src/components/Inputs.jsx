import PropTypes from "prop-types";

export default function Inputs({ title, name, checked, setter }) {
  const handleCheckboxChange = () => (event) => {
    setter(event.target.checked);
  };

  return (
    <li>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={handleCheckboxChange(setter)}
      />
      <label htmlFor={name}>{title}</label>
    </li>
  );
}

Inputs.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  setter: PropTypes.func.isRequired,
};
