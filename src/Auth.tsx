export default async function Auth(email: string, password: string) {
  let data: any[] = [];
  await fetch('http://localhost:3000/users')
    .then((response) => {
      return response.json();
    })
    .then((finalData) => {
      data = finalData;
      console.log(data);
    });
}
