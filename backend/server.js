const express = require('express');
const bodyParser = require('body-parser');
const cors =  require('cors');

const gangPlanDetailRoutes = require('./routes/updateRptRoutes/gangPlanDetailRoute.js')
const voyageNameRoute = require('./routes/voyageNameRoute.js')
const vesselNameRoute = require('./routes/vesselNameRoute.js')
const gangPlanDetailCarRoutes = require('./routes/updateRptRoutes/gangPlanDetailCarRoute.js')
const gangPlanDetailGenRoutes = require('./routes/updateRptRoutes/gangPlanDetailGenRoute.js')
const vprRoute = require('./routes/vprRptRoutes/vprRoute.js')
const cprRoute = require('./routes/cprRptRoutes/cprRoute.js')

const app = express();
app.use(bodyParser.json());
app.use(cors());

// API endpoints
app.use('/api/voyagenames', voyageNameRoute);
app.use('/api/vesselnames', vesselNameRoute);
app.use('/api/gangplandetails', gangPlanDetailRoutes);
app.use('/api/gangplandetailcars', gangPlanDetailCarRoutes);
app.use('/api/gangplandetailgen', gangPlanDetailGenRoutes);
app.use('/api/vpr-report', vprRoute);
app.use('/api/cpr-report', cprRoute)

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});