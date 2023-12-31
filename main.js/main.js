'use strict'

const url = 'https://reqres.in/api/users ';
const form = document.querySelector('.add-user-form')

const tbody = document.querySelector('#tbody')
let number;

fetch(url).then((response) => response.json()).then(data => {
    
  number = data.data.length;

    data.data.map((user) => {
        const {id,first_name ,last_name,email,avatar} = user

        const row = document.createElement('tr')
        row.innerHTML = `
        <td>${id}</td>
        <td>${first_name}</td>
        <td>${last_name}</td>
        <td>${email}</td>
        <td>
        <img src= '${avatar}' alt = '${first_name}'></img>
        </td>

        <td> 
              <button class = 'edit-button' data-id=${id} data-name=${first_name} data-lName=${last_name} data-email=${email} data-avatar=${avatar}>Edit</button>
        </td>

        <td> 
        <button class = 'delete-button' data-id=${id}>Delete</button>
  </td
        `
        tbody.appendChild(row)
    })
})


const add = document.querySelector('.add')
add.addEventListener('click',() =>  {

    form.classList.add('form')

})

form.addEventListener('submit', (e) => {
     e.preventDefault()

const id = document.querySelector('#update-id').value
const name = document.getElementById('names').value
const lName = document.getElementById('lName').value
const email = document.getElementById('email').value
const avatar = document.getElementById('avatar').files[0]
console.log(avatar);


const save =  document.querySelector('#save-user_button').textContent = 'Save'
form.classList.remove('form')

if(id){
    editUser(id,name, lName, email,avatar)
    form.reset()
}
else if(name === ''){
    alert('Malumot kiriting')
}
else{
    const person = {
        name: name,
        lName: lName,
        email: email,
        avatar:avatar
    }
    
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(person)
        }).then(response => response.json()).then(data => {
            const row = document.createElement('tr')

            const reader = new FileReader()
            reader.readAsDataURL(avatar)
            reader.onload = () => {
                const avatarUrl = reader.result
                row.innerHTML = `
                <td>${number}</td>
                <td>${name}</td>
                <td>${lName}</td>
                <td>${email}</td>
                <td>
                <img src= '${avatarUrl}' alt = '${name}'></img>
                </td>
        
                <td> 
                      <button class = 'edit-button' data-id=${data.id} data-name=${name} data-lName=${lName} data-email=${email} data-avatar=${avatarUrl}>Edit</button>
                </td>
        
                <td> 
                <button class = 'delete-button' data-id${id}=>Delete</button>
               </td
                `


            }
            tbody.appendChild(row)
number++
            form.reset()
    
        }).catch(err => console.error(err))

}
})



tbody.addEventListener('click', (e) => {

    if(e.target.classList.contains('edit-button')){

        const id = e.target.dataset.id
        const name = e.target.dataset.name
        const lname = e.target.dataset.lname
        const email = e.target.dataset.email


          document.querySelector('#update-id').value = id
          document.getElementById('names').value = name
          document.getElementById('lName').value = lname
          document.getElementById('email').value = email


          const save =  document.querySelector('#save-user_button').textContent = 'Update User'
          form.classList.add('form')
     

    }
    else if(e.target.classList.contains('delete-button')){
        alert("Rostan ham o'chirmoqchimisiz ")
        const id = e.target.dataset.id;
        deleteUser(id).then(() => {
            const tableRow = e.target.closest('tr')
            tableRow.remove()
        }).catch(error => console.error(error))


    }
})

async function deleteUser(id){
   try {
    const response = await fetch(`${url},${id}`,{
        method: 'DELETE',
    })
    if(response.ok){
        return response.text()
    }
   } 
    catch (error) {
        return console.error(error);
    
   }
}

async function editUser(id,name,lName,email,avatarUrl){

    const formData ={
        name:name,
        lName:lName,
        email:email,
        avatar:avatarUrl
    }
    return await fetch(`${url}/${id}`,{
        method: 'PUT',
        body:JSON.stringify(formData)
    }).then(response => response.json()).then(data => {
        const tableRow = document.querySelectorAll('tbody tr')

        for (const row of tableRow) {
            if(row.cells[0].textContent === id.toString()){
                row.cells[1].textContent = name
                row.cells[2].textContent = lName
                row.cells[3].textContent = email
                // row.cells[4].innerHTML = avatar
                // console.log(avatar);

                const reader = new FileReader()
                reader.readAsDataURL(avatarUrl)
                reader.onload = () => {
                    const avatar2 = reader.result
                    row.cells[4].innerHTML = `<td> <img src= '${avatar2}' alt = '${name}'></img></td>`
                    console.log(avatar2);

                }

            }
            
        }
        return data
         
    }).catch(err => console.error(err))
}


