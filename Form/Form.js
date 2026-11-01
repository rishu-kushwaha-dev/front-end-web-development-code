function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const phone = data.phone || '';
    if (phone.length !== 10) {
        alert("Phone number must be exactly 10 digits.");
        return;
    }

    console.log("Form Submitted Data:", data);

    alert("Thank you! Your event registration form has been successfully submitted.");
    form.reset();
}