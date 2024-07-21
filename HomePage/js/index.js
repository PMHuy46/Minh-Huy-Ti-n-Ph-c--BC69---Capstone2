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

let DSMua = [];
let count = 0
let priceBill = 0
let DSfilter = []

// lưu danh sách mua vào localstorage
const savelocalstorage = (key = "DsSpMua", value = DSMua) => {
    let stringJSON = JSON.stringify(value)
    localStorage.setItem(key, stringJSON)
}

// lấy ds có sẵn từ localstorge
const getlocalstorage = (key = "DsSpMua") => {
    let dataLocal = localStorage.getItem(key)
    if (dataLocal) {
        let reverData = JSON.parse(dataLocal)
        DSMua = reverData;
        for (item of DSMua) {
            let { inCart } = item
            count += inCart
        }
        document.querySelector(`#soLuongDaChon`).innerHTML = `${count}`
    }
}
getlocalstorage()

//get and render ds từ api
async function getValueOnMock() {
    try {
        let result = await axios({
            method: "GET",
            url: `https://6680c8e056c2c76b495cbc78.mockapi.io/product`,
        })
        DSfilter = result.data
        return result.data
    } catch (error) {
        console.log(error)
    }
}

getValueOnMock().then(() => {
    renderDSPet(DSfilter)
})

function renderDSPet(arr) { 
    let content = ""

    for (item of arr) {
        let {
            name,
            price,
            img,
            bestSale,
            id,
            quantity,
            desc,
        } = item
        content += `
        <div class="list_content">
            <div class="pet_item">
                <div class="pet_img">
                    <img src="${img}" alt="">
                </div>
                <div class="pet_info">
                    <span class = "maSp">Mã SP: ${id}</span></span>
                    <p id="name">${name}</p>
                    <p class = "descSp">Mô tả sơ sơ: ${desc.slice(0,25)} ...</p>
                    <div>
                    <p>Tồn: ${quantity}</p>
                    <p id="gia" class="giamGia">Giá: ${price.toLocaleString("vi", {
                    style: 'currency',
                    currency: 'VND',
                    })}</p>
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="button" onclick="muaSP(${id},${price})" class="buyBtn">Thêm vào giỏ</button>
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
    document.querySelector(`.list_pet`).innerHTML = content
}

//btn buy
function muaSP(idSP, price) {
    let index = DSMua.findIndex(item => item.id === idSP)
    if (index !== -1) {
        DSMua[index].inCart += 1
        count += 1
    } else {
        DSMua.push({
            id: idSP,
            inCart: 1,
            price
        })
        count += 1
    }
    document.querySelector(`#soLuongDaChon`).innerHTML = `${count}`
    savelocalstorage()
}

//btn thanh toán
const payBill = async () => {
    let content = ""
    priceBill = 0
    try {
        for (let [index, item] of DSMua.entries()) {
            const result = await axios({
                url: `https://6680c8e056c2c76b495cbc78.mockapi.io/product/${item.id}`,
                method: "GET"
            })

            let { img, desc, price } = result.data
            content += `
            <tr>
                <td class="STT">${index + 1}</td>
                <td>
                    <img src="${img}" alt="Hình ảnh mô tả sản phẩm" width="100px">
                </td>
                <td>
                    <div class="colDesc">
                        <span>Id: ${item.id}</span>
                        <span>${desc}</span>
                        <p>Price: ${price.toLocaleString("vi", {
                style: 'currency',
                currency: 'VND',
            })}</p>
                    </div>
                </td>
                <td>
                    <div class="colSoLuong" >
                        <input type="text" name="soLuong" id="soLuong${index}" value="${item.inCart}" style="width: 40px;">
                        <div class="changeSoLuong ">
                            <button type="button" class="btn btn-primary" onclick="addSP('${index}',-1)">-</button>
                            <button type="button" class="btn btn-primary" onclick="addSP('${index}')">+</button>
                        </div>
                    </div>
                </td>
            </tr>`
            priceBill += price * item.inCart
        }
    }
    catch (error) {
        console.log(error)
    }
    document.querySelector(`#billInfo`).innerHTML = content
    document.querySelector(`#tongTien`).innerHTML = `${priceBill.toLocaleString("vi", {
        style: 'currency',
        currency: 'VND',
    })}`
}

document.querySelector(`#payCart`).onclick = payBill

// thêm bớt Sp
const addSP = (index, soLuong = 1) => {
    DSMua[index].inCart += soLuong

    if (DSMua[index].inCart < 0) {
        let result = confirm("Bạn không thích bé này ư?");
        if (result) {
            DSMua.splice(index, 1)
            payBill()
        } else {
            DSMua[index].inCart += 1
        }
    } else {
        count += soLuong * 1
        document.querySelector(`#soLuongDaChon`).innerHTML = count
        document.querySelector(`#soLuong${index}`).value = DSMua[index].inCart
        priceBill += DSMua[index].price * soLuong
        document.querySelector(`#tongTien`).innerHTML = `${priceBill.toLocaleString("vi", {
            style: 'currency',
            currency: 'VND',
        })}`
    }
    savelocalstorage()
}



//update sau khi thanh toán
const updateAPI = async () => {
    try {
        for (let item of DSMua) {
            const result = await axios({
                url: `https://6680c8e056c2c76b495cbc78.mockapi.io/product/${item.id}`,
                method: "GET"
            })
            let ob = {}
            Object.assign(ob, result.data)
            ob.quantity -= item.inCart
            try {
                let resolve = await axios({
                    method: "PUT",
                    url: `https://6680c8e056c2c76b495cbc78.mockapi.io/product/${item.id}`,
                    data: ob,
                })

            } catch (error) {
                console.log(error)
            }
        }
    } catch (error) {
        console.log(error)
    }
    getValueOnMock().then(() => {
        renderDSPet(DSfilter)
    })
    DSMua = []
    document.querySelector(`#soLuongDaChon`).innerHTML = `0`
    document.querySelector(`#billInfo`).innerHTML = ``
    document.querySelector(`#tongTien`).innerHTML = `0`
    savelocalstorage()
}
document.querySelector(`#thanhToanBill`).onclick = updateAPI;

// filter
// filter theo key
async function filterByOption(value, type) {
    let valueFind = removeVietnameseTones(value.toLowerCase().trim());
    let typeFind = removeVietnameseTones(type.toLowerCase().trim());
    let ktra = typeFind.split(" ")

    let arrFiltered = []
    try {
        const data = await getValueOnMock();
        if (ktra.length == 1) {
            arrFiltered = data.filter(item => {
                let typeValue = removeVietnameseTones(item[`${ktra[0]}`].toLowerCase().trim());
                return typeValue.includes(valueFind)
            })
        } else {
            let arrType = data.filter(item => {
                let typeValue = removeVietnameseTones(item.type.toLowerCase().trim());
                return typeValue.includes(ktra[0])
            })
            arrFiltered = arrType.filter(item => {
                let typeValue = removeVietnameseTones(item[`${ktra[1]}`].toLowerCase().trim());
                return typeValue.includes(valueFind)
            })
        }
        DSfilter = arrFiltered
    } catch {
        console.log("error")
    }
}

//reset filter
document.querySelector(`.resetFilter`).onclick = function () {
    getValueOnMock().then(() => {
        renderDSPet(DSfilter)
    })
}
// filter theo giá
function sapXepDS(x, arr = DSfilter) {
    let arr1 = arr.sort((a, b) => a.price * x - b.price * x)
    renderDSPet(arr1)
}

// add event click cho thẻ 
document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".filterByValue");
    let selectFil = document.querySelectorAll(".form-select");
    // thêm onclick cho thẻ select
    selectFil.forEach(function (option) {
        option.addEventListener("click", function (event) {
            event.preventDefault();
            let { value } = option
            sapXepDS(value)
        })
    })
    // Thêm sự kiện onclick cho từng thẻ <a>
    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            let { text, title } = link;
            filterByOption(text, title).then(() => {
                renderDSPet(DSfilter)
            })
        });
    });
    // fixed menu filter
    window.addEventListener('scroll', function () {
        const menu = document.getElementById('menu');
        const ktrtop = document.querySelector(`#product`);
        const ktrabottom = document.querySelector(`footer`);
        const productvt = ktrtop.getBoundingClientRect();
        const footervt = ktrabottom.getBoundingClientRect();
        const checkmenu = menu.getBoundingClientRect();

        if (productvt.top <= 110 && productvt.height >= checkmenu.height + 100) {
            menu.classList.add('fixed');
        }
        if (footervt.top <= checkmenu.height + 125 || productvt.top > 120) {
            menu.classList.remove('fixed');
        }
        //không biết làm sao để menu nó dừng lại ngay footer có gì memtor chỉ giúp em
    });
});
