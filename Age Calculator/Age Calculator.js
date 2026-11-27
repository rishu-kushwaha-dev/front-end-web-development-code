function calculateAge() {
    const dobInput = document.getElementById('dob').value;
    
    if (!dobInput) {
        alert('Please select your date of birth');
        return;
    }
    
    const dob = new Date(dobInput);
    const today = new Date();
    
    // Check if date is in future
    if (dob > today) {
        alert('Date of birth cannot be in the future');
        return;
    }
    
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        // Get days in previous month
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += previousMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total days
    const timeDiff = today - dob;
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Display results
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('totalDays').textContent = `Total Days: ${totalDays.toLocaleString()}`;
    
    document.getElementById('result').style.display = 'block';
}
