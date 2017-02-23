import fetch from 'isomorphic-fetch'


export const
    TEMPLATE = 'TEMPLATE'

export const template = () => ({
  type: TEMPLATE
})


export const fetchData = () => dispatch => {
  dispatch(template())

  return fetch
      .get(`http://`)
      .then(res => res.text())
      .then(text => dispatch(template(text)))
}
