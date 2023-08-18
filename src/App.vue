<template>
    <div v-show="!isEditMode">
        <h1>User profile</h1>
        <img :src="image" alt="colored pencil sketch of a Medieval peasant breaking stones">

        <span>Name: </span><strong id="name">{{ name }}</strong>
        <hr/>
        
        <span>Email: </span><strong id="email">{{ email }}</strong>
        <hr/>

        <span>Interests: </span><strong id="interests">{{ interests }}</strong>
        <hr/>

        <button @click="handleEditProfile">Edit Profile</button>
    </div>

    <div v-show="isEditMode">
        <h1>User profile</h1>
        <img :src="image" alt="colored pencil sketch of a Medieval peasant breaking stones">
        
        <span>Name: </span>
        <input type="text" id="input-name" v-model="name" required>
        <hr/>
        
        <span>Email: </span>
        <input type="email" id="input-email" v-model="email" required>
        <hr/>

        <span>Interests: </span>
        <input type="text" id="input-interests" v-model="interests">
        <hr/>

        <button @click="handleUpdateProfile">Update Profile</button>
    </div>
</template>

<script>
import image from "./profile2.jpg"
export default {
    name: "App",
    data() {
        return {
            image: image,
            name: "",
            email: "",
            interests: "",
            isEditMode: false
        }
    },
    async created() {
        const userData = await this.fetchUserProfile()
        this.name = userData.name
        this.email = userData.email
        this.interests = userData.interests
    },
    methods: {
        handleEditProfile() {
           this.isEditMode = true
        },
        async handleUpdateProfile() {
            const payload = {
                name: this.name,
                email: this.email,
                interests: this.interests
            }
            const resJson = await this.updateUserProfile(payload)
            console.log(resJson)
            this.isEditMode = false
        },
        async fetchUserProfile() {
            const  res = await fetch('get-profile')
            return await res.json()
        },
        async updateUserProfile(payload) {
            const res = await fetch('update-profile', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            return await res.json()
        }
    }
}    
</script>

<style>
img {
    width: 320px;
    height: 270px;
    display: block;
    margin-bottom: 40px;
}

hr {
    width: 400px;
    margin: 25px 0px;
}

button {
    width: 160px;
    font-size: 16px;
    height: 45px;
    border-radius: 5px;
}

button:hover {
    cursor: pointer;
    background-color: lightgray;
}

body {
    font-family: 'Indie Flower', sans-serif;
}

h1 {
    font-family: 'MedievalSharp', sans-serif;
}

span {
    font-family: 'MedievalSharp', sans-serif;
}

div {
    width: 80%;
    margin: 40px auto;
}

input {
    width: 280px;
    font-size: 16px;
    padding: 10px;
}
</style>