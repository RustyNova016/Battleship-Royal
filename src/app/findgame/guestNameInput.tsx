"use client"
import {useForm} from "react-hook-form";
import axios from "axios";

interface GuestNameInputForm {
    guestName: string
}

export function GuestNameInput() {
    const {register, handleSubmit} = useForm<GuestNameInputForm>();

    async function onSubmit(data: GuestNameInputForm) {
        if (data.guestName !== "") {
            axios.post("api/account/loginAsGuest", {name: data.guestName})
        }
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder={"Enter Name"} {...register("guestName")}/>
        <button type="submit">Send</button>
    </form>
}