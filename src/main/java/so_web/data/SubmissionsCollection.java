package so_web.data;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.MongoWriteException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.util.Iterator;

import static com.mongodb.client.model.Projections.include;

public class SubmissionsCollection {
    private static MongoCollection<Document> submissionsCollection;
    private static final String titleF = "title", tagsF = "tags";
    private static final Bson index =
            Indexes.compoundIndex(Indexes.ascending(titleF), Indexes.ascending(tagsF));
    private static final IndexOptions indexOptions =  new IndexOptions().unique(true);

    private SubmissionsCollection() {
    }

    public static void init(String host, String rootPassword) {
        submissionsCollection = new MongoClient(new MongoClientURI("mongodb://root:" + rootPassword + '@' + host))
                .getDatabase("so").getCollection("submissions");
        submissionsCollection.createIndex(index, indexOptions);
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
