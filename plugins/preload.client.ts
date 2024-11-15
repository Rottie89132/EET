
export default defineNuxtPlugin( async () => {

    const { data }: any = await useFetch("/api/restaurants");

    data.value.restaurants.forEach((restaurant: any) => {
        [restaurant.thumbnail].forEach((image: any) => {
            const session = sessionStorage.getItem(`${restaurant.naam}-thumbnail`);

            if (!session){
                const img = new Image();
                img.src = image.data.publicUrl;
                sessionStorage.setItem(`${restaurant.naam}-thumbnail`, JSON.stringify(image));
            }
        });
    });
});

