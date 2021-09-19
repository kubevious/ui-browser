import { app } from '@kubevious/ui-framework';

export const MARKER_FOO = 'foo';
export const MARKER_BAR = 'bar';

const data = {
    [MARKER_FOO]: { shape: 'f164', color: '#F83759' },
    [MARKER_BAR]: { shape: 'f134', color: '#11E7E9' }
}
app.sharedState.set('markers_dict', data);