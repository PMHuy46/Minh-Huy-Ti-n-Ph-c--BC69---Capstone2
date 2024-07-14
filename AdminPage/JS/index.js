// chức năng thông báo lỗi cho người dùng
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

// lấy dữ liệu mock
async function getAllThuCung() {
  try {
    const resolve = await axios({
      method: "GET",
      url: "https://6692558e346eeafcf46c934b.mockapi.io/CAPSTONE2",
    });

    document.getElementById("renderCards").innerHTML = renderArrPet(
      resolve.data
    );

    console.log(resolve.data);
  } catch (error) {
    showError("Có lỗi xảy ra vui lòng thử lại !");
  }
}
getAllThuCung();

// lấy thông tin thẻ form
const getInfoForm = () => {
  let arrField = document.querySelectorAll(".form input, .form select");
  let pet = {};
  for (let field of arrField) {
    // destructuring
    let { id, value } = field;

    // dynamic key
    pet[id] = value;
  }
  return pet;
};

// Hàm renderArrPet
const renderArrPet = (arr) => {
  let content = "";
  let count = 0;

  arr.forEach((pet, index) => {
    let {
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

    // Mỗi khi đạt đủ 3 card, thêm một dòng mới
    if (count % 3 === 0) {
      content += '<div class="row mb-4">';
    }

    content += `
      <div class="col-md-4 mt-4">
        <div class="card text-dark text-center">
          <img src="${img}" class="card-img-top mx-auto mt-3" alt="${name}" style="width: 150px; height: 150px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text"><strong>Giống:</strong> ${species}</p>
            <p class="card-text"><strong>Giá:</strong> ${price}</p>
            <p class="card-text">${desc}</p>
            <p class="card-text"><strong>Loài:</strong> ${type}</p>
            <p class="card-text"><strong>Xuất xứ:</strong> ${origin}</p>
            <p class="card-text"><strong>Best Sale:</strong> ${
              bestSale ? "Có" : "Không"
            }</p>
          </div>
          <div class='m-4'>
            <button id='xoa'class='btn'>Xóa</button>
            <button id='sua'class='btn'>Sửa</button>
          </div>
        </div>
      </div>
    `;

    count++;

    // Đóng dòng khi đủ 3 card hoặc khi đến cuối mảng
    if (count % 3 === 0 || index === arr.length - 1) {
      content += "</div>"; // Đóng row
    }
  });

  return content;
};

// chức năng thêm pet
const addPetApi = (event) => {
  event.preventDefault();

  const pet = getInfoForm();

  let promise = axios({
    method: "POST",
    url: "https://6692558e346eeafcf46c934b.mockapi.io/CAPSTONE2",
    data: pet,
  });
  promise
    .then((resoleve) => {
      getAllThuCung();
    })
    .catch((error) => {
      showError(error.response.data);
    });
};
document.querySelector(".form").onsubmit = addPetApi;
