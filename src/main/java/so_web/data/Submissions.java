package so_web.data;

import com.mongodb.MongoWriteException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;

import java.util.Iterator;

import static com.mongodb.client.model.Projections.include;

public class Submissions {
    private static final String submissionsC = "submissions", titleF = "title", tagsF = "tags";
    private static MongoCollection<Document> submissionsCollection;

    private Submissions() {
    }

    public static void init(MongoTemplate mongoTemplate) {
        mongoTemplate.indexOps(submissionsC).ensureIndex(
                new Index().on(titleF, Sort.Direction.ASC).on(tagsF, Sort.Direction.ASC).unique());
        submissionsCollection = mongoTemplate.getCollection(submissionsC);
    }

    public static void addSubmission(PredictRes newSubmission) {
        try {
            submissionsCollection.insertOne(new Document()
                    .append(titleF, newSubmission.title).append(tagsF, newSubmission.result));
        }
        catch (MongoWriteException ignored) {
        }
    }

    public static String documentsToTSV() {
        FindIterable<Document> findIt = submissionsCollection.find().projection(include(titleF, tagsF));

        StringBuilder sb = new StringBuilder(titleF + '\t' + tagsF + '\n');
        for (Document document : findIt) {
            sb.append(document.getString(titleF)).append("\t[");
            Iterator<String> resIt = document.getList(tagsF, String.class).iterator();
            if (resIt.hasNext()) {
                sb.append('\'');
                sb.append(resIt.next());
                sb.append('\'');
            }
            while (resIt.hasNext()) {
                sb.append(", '");
                sb.append(resIt.next());
                sb.append('\'');
            }
            sb.append("]\n");
        }
        return sb.toString();
    }
}
