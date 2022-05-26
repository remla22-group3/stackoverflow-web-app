package myweb.ctrl;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AuxController {

	private final String modelHost;

	private int numPred = 0;

	public AuxController(Environment env) {
		modelHost = env.getProperty("MODEL_HOST");
	}

	public void addPrediction() {
		numPred++;
	}

	@GetMapping("/")
	@ResponseBody
	public String index() {
		return "Hello World!<br/><br/>" +
				"Model host: " + modelHost + "<br/>";
	}

	@GetMapping(value = "/metrics", produces = "text/plain")
	@ResponseBody
	public String metrics() {
		return "# HELP my_random A random number\n" +
				"# TYPE my_random gauge\n" +
				"my_random " + Math.random() + "\n\n" +
				"# HELP num_pred Number of requested predictions\n" +
				"# TYPE num_pred counter\n" +
				"num_pred " + numPred + "\n\n";
	}
}
