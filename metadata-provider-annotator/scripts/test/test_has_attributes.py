from unittest import TestCase
import scripts.util.filter_utils as filter_utils
import scripts.constants as constants

ATT_NAMES_VALUES_VARIATIONS = [
    {
        "att_name": "sex",
        "att_name_variations": [
            "sex",
            "cell sex",
            "patient gender",
            "donor gender"
        ],
        "att_values": []
    },
    {
        "att_name": "disease",
        "att_name_variations": [
            "disease",
            "disease severity",
            "disease staging",
            "clincial information - disease outcome",
            "original disease abbreviation",
            "original disease annotation",
            "disease group"
        ],
        "att_values": [
            {
                "att_value": "hepatocellular carcinoma",
                "att_value_variations": [
                    "hepatocellular carcinoma",
                    "HCC",
                    "hepatocellular cancer",
                    "hepatocellular adenocarcinoma",
                    "hepatoma",
                    "hepatocarcinoma"
                ]
            }
        ]
    },
    {
        "att_name": "tissue",
        "att_name_variations": [
            "tissue",
            "tissue supergroup",
            "tissue source",
            "metastatic tissue",
            "disease location",
            "tissue subtype"
        ],
        "att_values": []
    },
    {
        "att_name": "age",
        "att_name_variations": [
            "age"
        ],
        "att_values": []
    }
]
INPUT_SAMPLE_1 = constants.RESOURCES_FOLDER + "/test/samples/sample1.xml"
INPUT_SAMPLE_2 = constants.RESOURCES_FOLDER + "/test/samples/sample2.xml"
INPUT_SAMPLE_3 = constants.RESOURCES_FOLDER + "/test/samples/sample3.xml"
INPUT_SAMPLE_4 = constants.RESOURCES_FOLDER + "/test/samples/sample4.xml"
INPUT_SAMPLE_5 = constants.RESOURCES_FOLDER + "/test/samples/sample5.xml"


class TestHasAttributes(TestCase):

    def test_has_attributes_1(self):
        """
        Check attribute name
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": []}]
        self.assertTrue(check_has_attributes(INPUT_SAMPLE_1, specs_filter, ATT_NAMES_VALUES_VARIATIONS))

    def test_has_attributes_2(self):
        """
        Check non-existing attribute name
        :return:
        """
        specs_filter = [{"att_name": "age", "att_values": []}]
        self.assertFalse(check_has_attributes(INPUT_SAMPLE_1, specs_filter, ATT_NAMES_VALUES_VARIATIONS))

    def test_has_attributes_3(self):
        """
        Check invalid attribute name
        :return:
        """
        specs_filter = [{"att_name": "invalid_att", "att_values": []}]
        with self.assertRaises(ValueError):
            check_has_attributes(INPUT_SAMPLE_1, specs_filter, ATT_NAMES_VALUES_VARIATIONS)

    def test_has_attributes_4(self):
        """
        Check two attribute names
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": []}, {"att_name": "tissue", "att_values": []}]
        self.assertTrue(check_has_attributes(INPUT_SAMPLE_1, specs_filter, ATT_NAMES_VALUES_VARIATIONS))

    def test_has_attributes_4(self):
        """
        Check two attribute names, one of them does not exist
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": []}, {"att_name": "age", "att_values": []}]
        self.assertFalse(check_has_attributes(INPUT_SAMPLE_1, specs_filter, ATT_NAMES_VALUES_VARIATIONS))

    def test_has_attributes_5(self):
        """
        Check two attribute names, one of them invalid
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": []}, {"att_name": "invalid_att", "att_values": []}]
        with self.assertRaises(ValueError):
            check_has_attributes(INPUT_SAMPLE_1, specs_filter, ATT_NAMES_VALUES_VARIATIONS)

    def test_has_attributes_6(self):
        """
        Check an attribute name using a variation. Note that an empty array for att_values means to pick any value
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": []}]
        self.assertTrue(check_has_attributes(INPUT_SAMPLE_2, specs_filter, ATT_NAMES_VALUES_VARIATIONS))

    def test_has_attributes_7(self):
        """
        Check an attribute value
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": ["hepatocellular carcinoma"]}]
        self.assertTrue(check_has_attributes(INPUT_SAMPLE_1, specs_filter, ATT_NAMES_VALUES_VARIATIONS))

    def test_has_attributes_8(self):
        """
        Check an attribute value that does not exist
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": ["hepatocellular carcinoma"]}]
        self.assertFalse(check_has_attributes(INPUT_SAMPLE_3, specs_filter, ATT_NAMES_VALUES_VARIATIONS))

    def test_has_attributes_9(self):
        """
        Check an invalid attribute value
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": ["invalid_value"]}]
        with self.assertRaises(ValueError):
            check_has_attributes(INPUT_SAMPLE_1, specs_filter, ATT_NAMES_VALUES_VARIATIONS)

    def test_has_attributes_10(self):
        """
        Check an attribute that appears twice using different variations, only once with the value to be found
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": ["hepatocellular carcinoma"]}]
        self.assertTrue(check_has_attributes(INPUT_SAMPLE_4, specs_filter, ATT_NAMES_VALUES_VARIATIONS))

    def test_has_attributes_11(self):
        """
        Check an attribute value that needs normalization and reordering to be found
        :return:
        """
        specs_filter = [{"att_name": "disease", "att_values": ["hepatocellular carcinoma"]}]
        self.assertTrue(check_has_attributes(INPUT_SAMPLE_5, specs_filter, ATT_NAMES_VALUES_VARIATIONS))


# Utils
def check_has_attributes(sample_path, specs_filter, att_names_values_variations):
    relevant_atts_and_vars = filter_utils.filter_atts_and_variations(specs_filter, att_names_values_variations)
    with open(sample_path, 'r') as file:
        sample = file.read()
    return filter_utils.has_attributes(sample, relevant_atts_and_vars)
