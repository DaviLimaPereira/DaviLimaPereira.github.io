from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class DadosFormulario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    registro_funcional = db.Column(db.String(6))
    cargo = db.Column(db.String(100))
    secretaria = db.Column(db.String(100))
    setor = db.Column(db.String(100))

with app.app_context():
    db.create_all()



@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/listar')
def listar():
    dados = DadosFormulario.query.all()
    return render_template('lista.html', dados=dados)


@app.route('/enviar', methods=['POST'])
def enviar():
    nome = request.form['nome']
    registro_funcional = request.form['registro_funcional']
    cargo = request.form['cargo']
    secretaria = request.form['secretaria']
    setor = request.form['setor']

    dados = DadosFormulario(nome=nome, registro_funcional=registro_funcional, cargo=cargo, secretaria=secretaria, setor=setor)
    
    db.session.add(dados)
    db.session.commit()

    return redirect(url_for('listar'))



@app.route('/deletar/<int:id>')
def deletar(id):
    dado_deletar = DadosFormulario.query.get_or_404(id)
    db.session.delete(dado_deletar)
    db.session.commit()
    return redirect(url_for('listar'))

@app.route('/cadastrar')
def cadastrar():
    return render_template('formulario.html')

if __name__ == '__main__':
    app.run(debug=True)
    #app.run(host='0.0.0.0', port=5000)
