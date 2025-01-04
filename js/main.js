const $form = document.forms.register;
const $btn__limpiar = document.querySelector("#btn__limpiar")
const $btn__enviar = document.querySelector("#btn__enviar")
const $IdProducts = document.getElementById("products");
const URL = 'http://localhost:3001/products';

const DATA = {}

document.addEventListener("DOMContentLoaded", async () => {

  let $inputs = $form.querySelectorAll('input');

  $btn__limpiar.addEventListener("click", () => {
    console.log("clean");
    $inputs.forEach(element => {
      if (!element.value == "") element.value = ""

    });
  })
  /* -------------------------------- fetch get ------------------------------- */
  await fetch(URL)
    .then(response => {
      // network failure, request prevented
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }

      return Promise.reject(new Error(response.statusText));
    })
    .then(response => response.json())
    .then(result => {
      let templare = ''
      if (result.length === 0) {
        templare = `
        <article class="product">
        <div>
        <div class="description">
        <span
        >No  hay productos </span
        >
        </div>
        </div>
        </article >
        `
        $IdProducts.innerHTML = templare
        return templare
      }

      result.forEach((obj) => {
        templare += `
          <article id="item_${obj.id}" class="product">
          <figure>
          <img src="${obj.base64}">
          <figcaption><b>${obj.nombre}</b></figcaption>
          <span>$${obj.precio}</span >
          </figure >
          <input type="image" id="${obj.id}" onclick="deleted(${obj.id})" class="delete" src="./assent/img/Delete.png" title="Eliminar producto">
          </article >
          `
      })
      $IdProducts.innerHTML = templare

    })
    .catch(() => {
      let templare = ''
      templare = `
      <article class="product">
      <div>
       <div class="description">
       <span
       >Productos no encontrados o fallas de conexión</span
       >
       </div>
       </div>
       </article >
       `
      $IdProducts.innerHTML = templare
    });

  $form.addEventListener("submit", async e => {
    let $inputsValues = $form.querySelectorAll("input")
    let reader = new FileReader()

    $inputsValues.forEach((element) => {
      if (element.value === "") {
        e.preventDefault()
        let $span = document.createElement("span")
        let contentText = document.createTextNode("No puede estar vació")
        $span.appendChild(contentText)
        $span.style.color = "red"
        $form.insertBefore($span, element);
        element.insertAdjacentElement('afterend', $span);
        document.getElementById("btn__enviar").setAttribute("disabled", true)
        setTimeout(() => {
          $form.removeChild($span);
          document.getElementById("btn__enviar").removeAttribute("disabled")
        }, 3000)
        return

      }



    })
    reader.onload = async () => {
      DATA.imagen = {}
      DATA.id = `${document.querySelector("#products").children.length}`
      DATA.nombre = $inputsValues[0].value
      DATA.precio = parseInt($inputsValues[1].value)

      DATA.imagen = $inputsValues[2]['files'][0].name
      DATA.base64 = $inputsValues[2].value ? reader.result : ""
      console.log(DATA.base64);

      /* ------------------------------- fetch post ------------------------------- */
      await fetch(URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(DATA)
      })
        .then(response => {
          // network failure, request prevented
          if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
          }


          return Promise.reject(new Error(response.statusText));
        })
        .then(response => response.json())
        .then(result => {
          e.preventDefault()
          console.log(DATA);
          console.log(result);


        })
        .catch(error => {
          console.error(error);
          console.error("sin resultados");
          return null;
        });
    }
    e.preventDefault()
    console.log(DATA);
    console.log($inputsValues[2]['files']);
    reader.readAsDataURL($inputsValues[2]['files'][0])
  })
})

/* ------------------------------ main functions ----------------------------- */

if (document.querySelectorAll(".delete")) {

  function deleted(id) {
    console.log(id);
    const $product = document.querySelector(`article#item_${id} `);
    let dataProduct = {}
    dataProduct.id = id
    dataProduct.imagen = $product.children.item(0).children.item(0).getAttribute("src")
    dataProduct.nombre = $product.children.item(0).children.item(1).textContent
    dataProduct.precio = parseInt($product.children.item(0).children.item(2).textContent.split("$")[1])


    /* ------------------------------ fetch deleted ----------------------------- */
    fetch(URL + `/${id} `, {

      method: 'DELETE',

      headers: {

        'Content-Type': 'application/json'

      },

      body: JSON.stringify(dataProduct)

    })

      .then(response => response.json())

      .then(data => console.info(data))

      .catch(error => console.error(error));
  }
}




