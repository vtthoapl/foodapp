const getId = (id) => document.getElementById(id);
const baseUrl = 'https://632f046fb56bd6ac45a91659.mockapi.io/food';
(renderTotable = async () => {
  try {
    const res = await axios.get(baseUrl /* + '/' + 'food' */);
    const data = res.data;
    totalPrice(data);
    /*let content = '';
    for (let i = 0; i < data.length; i++) {
      const { name, img, price, quantity, id } = data[i];
      content += `
      
        <tr>
        <td>${id}</td>
        <td>${name}</td>
        <td> 
        <img class="imgCustom"
        src=${img}
        alt="#" />
        </td>
        <td id="prices">${(+price).toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND',
        })}</td>
        <td>${quantity}</td> 
        <td>
        <button onclick="updateBtn(${id})" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalUpdate_main">Update</button>
        <button onclick="deleteBtn(${id})" class="btn btn-success dropdown-toggle">Delete</button></td> 
        </tr>     
        `;
      //phai sua data-bs-target thanh id modal update modal
    } */
    //map: duyet 1 phan tu, vong lap rut gon
    const content = data.map((item, index) => {
      //destructuring, boc tach phan tu
      const { name, img, price, quantity, id } = item;
      return ` 
        <tr key=${index}>
        <td>${id}</td>
        <td>${name}</td>
        <td> 
        <img class="imgCustom"
        src=${img}
        alt="#" />
        </td>
        <td id="prices">${(+price).toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND',
        })}</td>
        <td>${quantity}</td> 
        <td>
        <button onclick="updateBtn(${id})" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalUpdate_main">Update</button>
        <button onclick="deleteBtn(${id})" class="btn btn-success dropdown-toggle">Delete</button></td> 
        </tr>     
        `;
    });

    getId('body').innerHTML = content;
  } catch (error) {
    console.log(error);
  }
})();

getId('addNew').addEventListener('click', async () => {
  try {
    const modalAdd = document.querySelectorAll('#modalAdd>div>input');
    const newData = {
      name: modalAdd[0].value,
      img: modalAdd[1].value,
      price: modalAdd[2].value,
      quantity: modalAdd[3].value,
    };
    await axios.post(baseUrl, newData);
    renderTotable();
  } catch (error) {
    console.log(error);
  }
});

const deleteBtn = async (value) => {
  //confirm(' confirm Yes if you wanna delete this one'); Hoi Tri lam sao de long yes no
  let answer = confirm('do you wanna delete');
  if (answer) {
    try {
      await axios.delete(`${baseUrl}/${value}`);
      // hien them nut dong y xoa sua lan 2 (tu chay 1 phat ra luon, ko ham trong ham)

      renderTotable();
    } catch (error) {
      console.log(error);
    }
  } else {
    renderTotable();
  }
};

const updateBtn = async (value) => {
  //strp1:get infor
  try {
    const res = await axios.get(`${baseUrl}/${value}`);
    const { id, name, img, price, quantity } = res.data;
    const modalAdd = document.querySelectorAll('#modalUpdate>div>input');
    modalAdd[0].value = name;
    modalAdd[1].value = img;
    modalAdd[2].value = price;
    modalAdd[3].value = quantity;
    getId('submitBtn').setAttribute('dataid', id);

    // lay tu dong 66, dat ten truong du lieu, nhung khong can lay ra
  } catch (error) {
    console.log(error);
  }

  //step2: ham trong ham , de submit
  getId('submitBtn').addEventListener('click', async () => {
    try {
      const valueId = getId('submitBtn').getAttribute('dataid');
      const modalAdd = document.querySelectorAll('#modalUpdate>div>input');
      const newData = {
        name: modalAdd[0].value,
        img: modalAdd[1].value,
        price: modalAdd[2].value,
        quantity: modalAdd[3].value,
      };
      await axios.put(`${baseUrl}/${valueId}`, newData);
      //data[index] = newData
      getId('closeUpdate').click();
      renderTotable();
    } catch (error) {
      console.log(error);
    }
  });
};

// home work: tinh tong tien ra div (o HTML)

const totalPrice = (v) => {
  const spanPrice = getId('totalPrice');
  /*  let total = 0;
  for (const iterator of v) {
    total += +iterator.price * +iterator.quantity;
    console.log(iterator.price);
  }
  spanPrice.innerHTML = total.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'VND',
  }); */

  //Cach 2: reduce

  const total = v.reduce(
    (prev, curr) => (prev += curr.price * curr.quantity),
    0
  );
  spanPrice.innerHTML = (+total).toLocaleString('it-IT', {
    style: 'currency',
    currency: 'VND',
  });
};

//reduce: vong lap rut gon,
//prev= 0
