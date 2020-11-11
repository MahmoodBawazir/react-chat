import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

const Head = (props) => {
  const { title, description, image, type, lang, children } = props
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
    >
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={
          image
            ? image
            : 'https://spectrum.chat/img/apple-icon-144x144-precomposed.png'
        }
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type || 'website'} />
      <meta
        property="og:image"
        content={
          image
            ? image
            : 'https://spectrum.chat/img/apple-icon-144x144-precomposed.png'
        }
      />
      {children}
    </Helmet>
  )
}

Head.defaultProps = {
  lang: `en`,
  description: ``,
}

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  children: PropTypes.any,
  type: PropTypes.string,
}

export default Head
