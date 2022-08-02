const app = require("../server/server");
const request = require('supertest');


describe('Endpoints', () => {
  it('should login', async () => {
    const res = await request(app)
      .get('/login=liraz@email.com&123456&user')

    expect(res.body).toEqual({
        status: true,
        message: "log in successful",
      })
  })

  it('should create account and not when user exists', async () => {
    const res = await request(app)
      .post(`/createAccount=${Math.random()}@email.com&user`)
      .send({
        name: 'gil',
        phoneNumber:'5555',
        password: '123'
      })

    expect(res.body).toEqual({
        status: true,
        message: "User account successfully created",
      })
  })

  const time = `7/12/${Math.random()}`
  it('should add appointment', async () => {
    const res = await request(app)
      .post('/addAppointment')
      .send({
        userId: 'liraz@email.com',
        businessId: 'dana@email.com',
        service: 'Facial treatments',
        date: '7/15/2022',
        userName: 'liraz bono',
        phone: '79878797',
        time: time,
      })

    expect(res.body).toEqual({
        status: true,
        message: "appointment made",
      })
  })

  it('should not add appointment', async () => {
    const res = await request(app)
      .post('/addAppointment')
      .send({
        userId: 'liraz@email.com',
        businessId: 'dana@email.com',
        service: 'Facial treatments',
        date: '7/15/2022',
        userName: 'liraz bono',
        phone: '79878797',
        time: time,
      })

    expect(res.body).toEqual({
        status: false,
        message: "time not available",
      })
  })

//   it('should not edit appointment', async () => {
//     const res = await request(app)
//       .post(`/editAppointment=liraz@email.com&dana@email.com&7/15/2022&${time}`)
//         .send({
//         userId: 'liraz@email.com',
//         businessId: 'dana@email.com',
//         service: 'Facial treatments',
//         date: '7/15/2022',
//         userName: 'liraz bono',
//         phone: '79878797',
//         time: time,
//       })

//     expect(res.body).toEqual({
//         status: false,
//         message: "time not available",
//       })
//   })

//   it('should edit appointment', async () => {
//     const res = await request(app)
//       .post(`/editAppointment=liraz@email.com&dana@email.com&7/15/2022&${time}`)
//       .send({
//         userId: 'liraz@email.com',
//         businessId: 'dana@email.com',
//         service: 'Facial treatments',
//         date: '7/15/2022',
//         userName: 'liraz bono',
//         phone: '79878797',
//         time: Math.random(),
//       })

//     expect(res.body).toEqual({
//         status: true,
//         message: "appointment updated",
//       })
//   })


  it('should save video path', async () => {
    const res = await request(app)
        .post('/saveVideoPath=test@email.com&hello')
    expect(res.body).toEqual({
        status: true,
        message: "video saved",
      })
  })

  it('should edit video path', async () => {
    const res = await request(app)
        .post('/updateVideoPath=test@email.com&helloWorld')
    expect(res.body).toEqual({
        status: true,
        message: "saved new path"
      })
  })

  it('should get accounts by category', async () => {
    const res = await request(app)
      .get('/getAccountsByCategory=cosmetics')
      
    expect(res.body.status).toEqual(true)
  })
})   