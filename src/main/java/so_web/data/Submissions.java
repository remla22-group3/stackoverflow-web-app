package so_web.data;

import java.util.LinkedHashSet;
import java.util.Set;

public class Submissions {
    private static Submissions INSTANCE = null;
    private final Set<PredictRes> submissionSet = new LinkedHashSet<>();

    public static Submissions getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new Submissions();
        }
        return INSTANCE;
    }

    public void addSubmission(PredictRes newSubmission) {
        submissionSet.add(newSubmission);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("title\ttags\n");
        for (PredictRes submission : submissionSet) {
            sb.append(submission.title).append("\t[");
            String[] res = submission.result;
            if (res.length > 0) {
                sb.append('\'');
                sb.append(res[0]);
                sb.append('\'');
            }
            for (int i = 1; i < res.length; i++) {
                sb.append(", '");
                sb.append(res[i]);
                sb.append('\'');
            }
            sb.append("]\n");
        }
        return sb.toString();
    }
}
