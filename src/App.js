import React, { Component } from 'react'
import Comments from './Comments'
import NewComment from './NewComment'
import Login from './Login'
import SignUp from './SignUp'
import User from './User'
import 'bootstrap-css-only'

class App extends Component {
  state = {
    comments: {},/*Representa o valor que esta no textarea, lista de valores */
    isLoading: false,
    isAuth: false,
    isAuthError: false,
    authError: '',
    isSignUpError: false,
    signUpError: '',
    user: {},
    userScreen: 'login'
  }
  sendComment = comment => {
    const {database} = this.props
    const id = database.ref().child('comments').push().key
    const comments = {}
    console.log(this.state.user)
    comments['comments/'+id] = {
      comment,
      email: this.state.user.email,
      userid: this.state.user.uid
    }
    database.ref().update(comments)
  }
 
 login = async(email, passwd) => {
   const { auth } = this.props;
   this.setState({
     authError: '',
     isAuthError: false
   })
   try{
    await auth.signInWithEmailAndPassword(email,passwd)
   }catch(err){
    this.setState({
      authError: err.code,
      isAuthError: true
    })
   } 
 } 

 createAccount = async(email, passwd) => {
  const { auth } = this.props;
  this.setState({
    signUpError: '',
    isSignUpError: false
  })
  try{
   await auth.createUserWithEmailAndPassword(email,passwd)
  }catch(err){
   this.setState({
     signUpError: err.code,
     isSignUpError: true
   })
  } 
} 
 componentDidMount(){
   const { database,auth } = this.props
   this.setState({ isLoading: true })
   this.comments = database.ref('comments')
   this.comments.on('value', snapshot => {
     console.log('passou aqui')
    this.setState({ 
      comments: snapshot.val(),
      isLoading: false 
    })
   })
   auth.onAuthStateChanged(user => {
     if(user){//checando o estado da aplicação
       this.setState({
         isAuth: true,
         user
       })
     }else{
        this.setState({
          isAuth: false,
          user: {}
        })
     }
   })
 } 

 logout = () => {
   const { auth } = this.props;
   auth.signOut()
 }

 changeScreen = (screen) => {
   this.setState({
     userScreen: screen
   })
 }
  render() {
    return (
      <div className='container mt-3'>
        {this.state.isAuth && <User email={this.state.user.email} logout={this.logout}/>  }
        { !this.state.isAuth 
          && this.state.userScreen === 'login' &&
          <Login login={this.login} isAuthError={this.state.isAuthError} authError={this.state.authError} changeScreen={this.changeScreen}/>
        }
        { !this.state.isAuth 
          && this.state.userScreen === 'signup' &&
          <SignUp createAccount={this.createAccount} isSignUpError={this.state.isSignUpError} signUpError={this.state.signUpError} changeScreen={this.changeScreen}/>
        }
        {this.state.isAuth && <NewComment sendComment={this.sendComment} />}
        <Comments comments={this.state.comments} />
        {
          this.state.isLoading && <p>Carregando...</p>
        }
      </div>
    );
  }
}

export default App;
