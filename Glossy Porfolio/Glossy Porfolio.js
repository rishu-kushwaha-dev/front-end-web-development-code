const li = document.querySelectorAll('.menu ul li');


li.forEach((item) => {
    item.addEventListener('click', () => {

        li.forEach((v) => {
            v.classList.remove('active');
        })

        item.classList.add('active')

    })
})