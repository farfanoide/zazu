import git from './git'
import github from './github'

export default git.isInstalled() ? git : github
