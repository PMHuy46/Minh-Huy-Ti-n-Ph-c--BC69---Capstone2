
const sun = document.querySelector('.gg-sun');
const moon = document.querySelector('.gg-moon');
const body = document.querySelector('body');

sun.addEventListener('click', function () {
    this.classList.toggle('active');
    moon.classList.toggle('active');
    body.classList.toggle('bg-dark');
});
moon.addEventListener('click', function () {
    sun.classList.toggle('active');
    this.classList.toggle('active');
    body.classList.toggle('bg-dark');
});


async function getValueOnMock() {
    try {
        let resolve = await axios({
            method: "GET",
            url: `https://6680c8e056c2c76b495cbc78.mockapi.io/product`,
        })
        console.log(resolve.data)
        renderDSPet(resolve.data)
    } catch (error) {
        console.log(error)
        // showError("có lỗi nè")
    }

}
getValueOnMock()

function renderDSPet(arr) {
    let content = ""

    for (item of arr) {
        let {
            name,
            price,
            img,
            bestSale,
            id,
        } = item
        content += `
        <div class="col-3 pet">
            <div class="pet_item">
                <div class="pet_img">
                    <img src="${img}" alt="">
                </div>
                <div class="pet_info">
                    <p id="id">Mã sp: ${id}</p>
                    <h4 id="name">${name}</h4>
                    <p id="gia" class="giamGia">${price}</p>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="button" class="buyBtn">Mua</button>
                </div>`
        if (bestSale) {
            content += `
            <div class="quangCao">
                <span>
                    Best<br>saler
                </span>
            </div>
            </div>
            </div>`
        } else {
            content += `</div>`
        }
    }
    console.log(content)
    document.querySelector(`.list_pet`).innerHTML=content
}