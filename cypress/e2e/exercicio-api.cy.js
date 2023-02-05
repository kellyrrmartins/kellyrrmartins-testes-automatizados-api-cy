/// <reference types="cypress" />
import contratoUs from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               contratoUs.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then(response => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
          })

     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `usuario${Math.floor(Math.random() * 10000)}`
          cy.cadastrarUsuario(usuario, `${usuario}@qa.com.br`, 'teste', 'true')
               .then(response => {
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
                    expect(response.status).to.equal(201)

               })

     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario('Fulano da Silva', 'fulano@qa.com.br', 'teste', 'true')
               .then(response => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')

               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let usuario = `usuario${Math.floor(Math.random() * 10000)}`
          cy.cadastrarUsuario(usuario, `${usuario}@qa.com.br`, 'teste', 'true')
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         body: {

                              "nome": usuario,
                              "email": `${usuario}@qa.com.br`,
                              "password": "teste",
                              "administrador": "false"

                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `usuario${Math.floor(Math.random() * 10000)}`
          cy.cadastrarUsuario(usuario, `${usuario}@qa.com.br`, 'teste', 'true')
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })
     });


});
