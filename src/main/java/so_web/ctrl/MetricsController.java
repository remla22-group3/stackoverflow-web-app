package so_web.ctrl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/metrics")
public class MetricsController {
    private int numPred = 0;

    public MetricsController() {
        super();
    }

    @GetMapping(produces = "text/plain")
    @ResponseBody
    public String metrics() {
        return "# HELP my_random A random number\n" +
                "# TYPE my_random gauge\n" +
                "my_random " + Math.random() + "\n\n" +
                "# HELP num_pred Number of requested predictions\n" +
                "# TYPE num_pred counter\n" +
                "num_pred " + numPred + "\n\n";
    }

    public void addPrediction() {
        numPred++;
    }
}
