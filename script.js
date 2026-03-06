const cart={

}
//categories button loading code
const loadCategories=async()=>{
  const url='https://openapi.programming-hero.com/api/categories';
  const res=await fetch(url);
  const data=await res.json();
  displayCategories(data.categories);
}
// categories button display code
const displayCategories=(categories)=>{
  const allCategoryBtn=document.getElementById('category-btn-section');
  categories.forEach(category=>{
    const btn=document.createElement('button');
    btn.className='category-btn btn btn-outline';
    btn.setAttribute('id',category.id);
    btn.setAttribute('onclick',`loadCategoryTree(${category.id})`);
    btn.textContent=category.category_name;
    allCategoryBtn.appendChild(btn);
  })
}

// all tress loading code 
const loadAllTress=async()=>{
  const url='https://openapi.programming-hero.com/api/plants';
  const res=await fetch(url);
  const data=await res.json();
  displayAllTrees(data.plants);
}


// display All tress code
const displayAllTrees=(plants)=>{
  const tressCardContainer=document.getElementById('trees-card-container');
  tressCardContainer.innerHTML='';
  plants.forEach(plant=>{
    const card=document.createElement('div');
    card.className=`card bg-base-100  shadow-sm p-4 h-full space-y-3 border-b-2 ${plant.price>500?'border-red-500':'border-green-500'}`;
    card.innerHTML=`
      <figure class="rounded-md">
        <img  
          src="${plant.image}"
          alt="${plant.name}"
          title="${plant.name}"
          class="h-48 w-full object-cover cursor-pointer"
          onclick="openTreeModal(${plant.id})"
        />
      </figure>
      <div>
        <h2 class="card-title cursor-pointer hover:text-[#4ade80]" onclick="openTreeModal(${plant.id})">${plant.name}</h2>
        <p class="line-clamp-2">${plant.description}</p>
      </div>
      <div class="flex justify-between items-center">
        <div class="badge badge-outline badge-success truncate">${plant.category}</div>
        <span class="font-semibold ${plant.price>500?'text-red-500':'text-green-500'}">$${plant.price}</span>
      </div>
      <div class="card-actions ">
        <button onclick="addToCart(${plant.id},'${plant.name}', ${plant.price})" class="btn w-full rounded-full active">Add to cart</button>
      </div>  
    `;
    tressCardContainer.appendChild(card);
  })
  
}

function loadCategoryTree(id){
  removeActiveClass();
  const selectedBtn=document.getElementById(id);
  selectedBtn.classList.add('active');
  const url=`https://openapi.programming-hero.com/api/category/${id}`
  fetch(url)
  .then(res=>res.json())
  .then(data=>displayAllTrees(data.plants))
}

loadCategories();
loadAllTress();

function removeActiveClass(){
  const allBtn=document.querySelectorAll('.category-btn');
  allBtn.forEach(btn=>{
    btn.classList.remove('active');
  })
}

const openTreeModal=async (id)=>{
  const res=await fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
  const data=await res.json();
  displayTreeDetails(data.plants)
  document.getElementById('my_modal').showModal()
}
function displayTreeDetails(plant){
  const myModal=document.getElementById('my_modal');
  myModal.innerHTML="";
  const modalBox=document.createElement('div');
  modalBox.className='modal-box space-y-4'
  modalBox.innerHTML=`
    <figure class="rounded-md">
        <img  
          src="${plant.image}"
          alt="${plant.name}"
          title="${plant.name}"
          class="h-70 w-full object-cover"
        />
      </figure>
      <div>
        <h2 class="card-title">${plant.name}</h2>
        <p>${plant.description}</p>
      </div>
      <div class="flex justify-between items-center">
        <div class="badge badge-outline badge-success truncate">${plant.category}</div>
        <span class="font-semibold ${plant.price>500?'text-red-500':'text-green-500'}">$${plant.price}</span>
      </div>
      <div class="card-actions ">
        <button onclick="addToCart(${plant.id},'${plant.name}', ${plant.price})" class="btn w-full rounded-full border-none active">Add to cart</button>
      </div>  
    <div class="modal-action">
        <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error">Close</button>
        </form>
    </div>
  `
  myModal.appendChild(modalBox)
}

function addToCart(id,name,price){
  cart[id]=(cart[id]||0)+1;
  calculateTotal(price);
  if(cart[id]>1){
    const count=document.getElementById(`count-${id}`)
    count.innerText=cart[id];
  }
  else{
    const cardContainer=document.getElementById('card-container');
    const card=document.createElement('div');
    card.className='flex justify-between items-center bg-base-100 p-1 rounded-md';
    card.setAttribute('id',`card-${id}`);
    card.innerHTML=`
      <div class="space-y-3">
        <h2>${name}</h2>
        <p>$${price} X <span id="count-${id}">1</span></p>
      </div>
      <button class="btn">X</button>
    `
    cardContainer.appendChild(card);
  }
}
function calculateTotal(price){
  const totalElm=document.getElementById('total');
  const totalValue=Number(totalElm.innerText);
  totalElm.innerText=price+totalValue;
}
document.getElementById('all-trees-btn').addEventListener('click',(event)=>{
  removeActiveClass();
  event.target.classList.add('active')
  loadAllTress() 
})
