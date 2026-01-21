import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import UseAxiosSecure from '../hooks/UseAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
const UserPractice = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const axiosSecure = UseAxiosSecure()
    const queryClient = useQueryClient()

    // fetch indegreints 
    const { data: ingredientsData } = useQuery({
        queryKey: ['ingredients-list'],
        queryFn: async () => {
            const res = await axiosSecure.get('ingredients', { params: { limit: 100 } })
            console.log('see the ingredients', res.data.data.ingredients)
            return res.data?.data?.ingredients || []
        }
    })

    const quantity = watch("quantity")
    const unitPrice = watch("unitPrice")
    const selectedId = watch("ingredientId")


    const selectedItem = ingredientsData?.find(item => item._id === selectedId)
    const totalCost = (parseFloat(quantity || 0) * parseFloat(unitPrice || 0)).toFixed(2)


    const onSubmit = (data) => {
        setLoading(true)
        try {

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    console.log(watch("example"))
    return (
        <div>

        </div>
    );
};

export default UserPractice;