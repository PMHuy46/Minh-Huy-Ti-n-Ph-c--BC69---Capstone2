function checkEmptyValue(value, errorEle) {
    console.log(`Value: "${value}", Error Element:, errorEle`);
    if (
      value.trim() === "" ||
      value === "Loại thú cưng" ||
      value === "Best sale"
    ) {
      errorEle.textContent = "Vui lòng không bỏ trống trường này!";
      errorEle.classList.add("error-message");
      return false;
    } else {
      errorEle.textContent = "";
      errorEle.classList.remove("error-message");
      return true;
    }
  }
  
  function validateForm() {
    const formFields = document.querySelectorAll(".form input, .form select");
    let isValid = true;
  
    formFields.forEach((field) => {
      const errorEle = field.nextElementSibling;
  
      // Bỏ qua input id
      if (field.id !== "id") {
        if (!checkEmptyValue(field.value, errorEle)) {
          isValid = false;
        }
      }
    });
  
    return isValid;
  }
  
  document.querySelector(".form").addEventListener("submit", (event) => {
    event.preventDefault();
  
    if (validateForm()) {
      const petData = getFormData();
  
      axios
        .post("https://6680c8e056c2c76b495cbc78.mockapi.io/product", petData)
        .then((response) => {
          showError("Thêm thú cưng thành công!");
          getAllPets();
          event.target.reset();
        })
        .catch((error) => {
          showError("Có lỗi xảy ra vui lòng thử lại !");
        });
    }
  });