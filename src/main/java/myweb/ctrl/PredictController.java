package myweb.ctrl;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Objects;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import myweb.data.Prediction;

@Controller
@RequestMapping(path = "/so")
public class PredictController {

	private final String modelHost;
	private final RestTemplateBuilder rest;
	private final AuxController auxController;

	public PredictController(RestTemplateBuilder rest, Environment env, AuxController auxController) {
		this.rest = rest;
		this.auxController = auxController;
		modelHost = env.getProperty("MODEL_HOST");
	}

	@GetMapping("/")
	public String index(Model m) {
		m.addAttribute("hostname", modelHost);
		return "so/index";
	}

	@PostMapping("/")
	@ResponseBody
	public Prediction predict(@RequestBody Prediction prediction) {
		auxController.addPrediction();

		prediction.result = getPrediction(prediction);

		return prediction;
	}

	private String[] getPrediction(Prediction prediction) {
		try {
			var url = new URI(modelHost + "/predict");
			var c = rest.build().postForEntity(url, prediction, Prediction.class);
			return Objects.requireNonNull(c.getBody()).result;
		} catch (URISyntaxException e) {
			throw new RuntimeException(e);
		}
	}
}
