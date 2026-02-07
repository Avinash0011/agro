import React , {useState} from "react";

function CreatePassword(fieldId){
    const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return { isVisible, toggleVisibility };
}

export default CreatePassword;