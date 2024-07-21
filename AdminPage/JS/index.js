// Hàm thông báo lỗi
const showError = (text, duration = 3000) => {
  Toastify({
    text: text,
    duration: duration,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background: "blue",
    },
    stopOnFocus: true,
  }).showToast();
};

// Lấy danh sách Pet
async function getAllPets() {
  try {
    const response = await axios({
      method: "GET",
      url: "https://6680c8e056c2c76b495cbc78.mockapi.io/product",
    });

    document.getElementById("renderCards").innerHTML = renderPetCards(
      response.data
    );

    console.log(response.data);
  } catch (error) {
    showError("Có lỗi xảy ra vui lòng thử lại !");
  }
}

// lấy dữ liệu data
const getFormData = () => {
  let formData = {};
  const formFields = document.querySelectorAll(".form input, .form select");

  formFields.forEach((field) => {
    const { id, value } = field;
    formData[id] = value;
  });

  return formData;
};

  // hàm renderCard
  const renderPetCards = (petsArray) => {
    let content = "";
    let count = 0;

    petsArray.forEach((pet, index) => {
      const {
        id,
        name,
        price,
        bestSale,
        img,
        desc,
        type,
        origin,
        species,
        quantity,
      } = pet;

      if (count % 4 === 0) {
        content += '<div class="row mb-4">';
      }

      content += `
        <div class="col-md-3 mt-4">
          <div class="card text-dark text-center">
            <img src="${img}" class="card-img-top mx-auto mt-3" style="width: 200px; height: 130px; object-fit: cover; " alt="id không tồn tại">
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text"><strong>Giống:</strong> ${species}</p>
              <p class="card-text"><strong>Giá:</strong> ${price}</p>
              <p class="card-text">${desc}</p>
              <p class="card-text"><strong>Loài:</strong> ${type}</p>
              <p class="card-text"><strong>Xuất xứ:</strong> ${origin}</p>
              <p class="card-text"><strong>Best Sale:</strong> ${
                bestSale ? "Yes" : "No"
              }</p>
            </div>
            <div class='m-4'>
              <button id='xoa' onclick= "deletePet(${id})" class='btn'>Xóa</button>

              <button id='sua' onclick="editPet(${id})" class='btn'>Sửa</button>
            </div>
          </div>
        </div>
      `;

      count++;

      if (count % 4 === 0 || index === petsArray.length - 1) {
        content += "</div>";
      }
    });

    return content;
  };

// Hàm thêm Pet
const addPet = (event) => {
  event.preventDefault();

  const petData = getFormData();

  axios({
    method: "POST",
    url: "https://6680c8e056c2c76b495cbc78.mockapi.io/product",
    data: petData,
  })
    .then((response) => {
      getAllPets();
    })
    .catch((error) => {
      showError("Có lỗi xảy ra vui lòng thử lại !");
    });

  event.target.reset();
};
document.querySelector(".form").onsubmit = addPet;

// Hàm xóa Pet
const deletePet = async (petId) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `https://6680c8e056c2c76b495cbc78.mockapi.io/product/${petId}`,
    });

    getAllPets();
  } catch (error) {
    showError("Có lỗi xảy ra vui lòng thử lại !");
  }
};

// Hàm nút sửa
const editPet = async (petId) => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://6680c8e056c2c76b495cbc78.mockapi.io/product/${petId}`,
    });

    const formFields = document.querySelectorAll(".form input, .form select");

    formFields.forEach((field) => {
      const { id } = field;
      field.value = response.data[id];
    });
  } catch (error) {
    showError("Có lỗi xảy ra vui lòng thử lại !");
  }
};

// Hàm nút cập nhật
const updatePet = async () => {
  try {
    const petData = getFormData();

    const response = await axios({
      method: "PUT",
      url: `https://6680c8e056c2c76b495cbc78.mockapi.io/product/${petData.id}`,
      data: petData,
    });

    getAllPets();
    document.querySelector(".form").reset();
  } catch (error) {
    showError("Có lỗi xảy ra vui lòng thử lại !");
  }
};
document.getElementById("capNhat").onclick = updatePet;

// Hàm search Pet
const searchPets = async () => {
  const searchValue = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();

  try {
    const response = await axios({
      method: "GET",
      url: "https://6680c8e056c2c76b495cbc78.mockapi.io/product",
    });

    const filteredPets = response.data.filter((pet) =>
      removeVietnameseTones(pet.name.toLowerCase()).includes(
        removeVietnameseTones(searchValue)
      )
    );

    document.getElementById("renderCards").innerHTML =
      renderPetCards(filteredPets);
  } catch (error) {
    showError("Có lỗi xảy ra vui lòng thử lại !");
  }
};

// Gọi hàm lấy full danh sách Pet 
getAllPets();
