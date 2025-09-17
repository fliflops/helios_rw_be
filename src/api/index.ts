import {Router} from 'express'
import user from './routes/user/user.route';
import auth from './routes/auth/auth.route';
import select from './routes/select/select.route';
import pod_view from './routes/pod-view/pod-view.route';
import pod_sorting from './routes/pod-sorting/pod-sorting.route';
import location from './routes/data-management/location/location.route';

const router = Router();

router.use('/pod-view',     pod_view)
router.use('/pod-sorting',  pod_sorting)

router.use('/auth',     auth)
router.use('/user',     user)
router.use('/select',   select)
router.use('/location', location)

export default router;