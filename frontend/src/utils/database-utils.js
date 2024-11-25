export async function getEmployees(employees) {
    const shiftsFromDB = await fetch(`/api/employees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'MANAGER_KEY'
        }
    })
    const data = await shiftsFromDB.json()
    console.log(data)
    return data
}

export async function getDepartments(departments) {
    const shiftsFromDB = await fetch(`/api/departments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'MANAGER_KEY'
        }
    })
    const data = await shiftsFromDB.json()
    console.log(data)
    return data
}