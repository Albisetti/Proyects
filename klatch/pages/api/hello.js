import { getStaticRoute, getDynamicRoute } from '@lib/routes'

export default function handler(req, res) {
  // Bail if no secret or slug defined
  res.status(200).json({
    echo: req.query.echo || 'Echo'
  })
}
