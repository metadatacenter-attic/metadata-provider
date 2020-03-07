#!/usr/bin/python3

import scripts.util.utils as utils
import scripts.util.filter_utils as filter_utils
import scripts.constants as constants
import xml.etree.ElementTree as ET
import os
import xmltodict
import json
import copy


def sample_to_json(sample, required_attributes):
    """
    Generates a simplified version of a biosample in JSON format
    :param sample:
    :param required_attributes:
    :return:
    """
    sample_json = {}

    biosample_node = ET.fromstring(sample)
    sample_atts = biosample_node.find('Attributes')
    if sample_atts is not None:

        # Export only the required attributes and their values.
        # If a required attribute is not found in the sample, set it to None
        for required_att in required_attributes:
            found = False
            for sample_att in sample_atts:
                attribute_name = sample_att.get('attribute_name')
                display_name = sample_att.get('display_name')
                harmonized_name = sample_att.get('harmonized_name')

                # Check if the current sample attribute matches the required attribute
                if (attribute_name is not None and attribute_name in required_att['att_name_variations']) or \
                        (display_name is not None and display_name in required_att['att_name_variations']) or \
                        (harmonized_name is not None and harmonized_name in required_att['att_name_variations']):
                    # Attribute found.
                    # Note that we transform the value to lower case because BioSample search ignores case too
                    found = True
                    sample_json[required_att['att_name']] = sample_att.text.lower()
                    break

            if not found:
                sample_json[required_att['att_name']] = None
                # print('Error: attribute to be exported was not found in sample: ' + required_att['att_name'])
                # sys.exit(1)

        return sample_json


def export_samples_to_csv(root_folder_name, input_file, output_file, filter_specs, atts_and_variations,
                          log_frequency=1000):
    """
    Generates a simplified version of the samples in CSV and saves them to a file
    :param samples: samples in BioSamples's XML format
    :param attributes:
    :return:
    """
    constants.BASE_FOLDER = utils.get_base_folder(root_folder_name)
    execute = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            execute = False
    if execute:
        # attribute names and variations of the attributes to be exported. We need to do this to be able to aggregate
        # different attribute variations so that the attribute values will be shown under the same column header
        relevant_atts_and_variations = filter_utils.filter_atts_and_variations(filter_specs, atts_and_variations)

        # Read and export samples
        exported_samples = []

        if not os.path.exists(os.path.dirname(output_file)):
            os.makedirs(os.path.dirname(output_file))

        print('Input file: ' + input_file)
        print('Output file: ' + output_file)
        print('Attributes to be exported: ' + str(filter_specs))
        print('Processing NCBI samples...')
        # Read biosamples from XML file
        content = utils.read_xml_or_gz_file(input_file)

        processed_samples_count = 0

        for event, node in content:
            if event == 'START_ELEMENT' and node.tagName == 'BioSample':
                content.expandNode(node)
                node_xml = node.toxml()
                processed_samples_count = processed_samples_count + 1

                if processed_samples_count % log_frequency == 0:
                    print('Processed samples: ' + str(processed_samples_count))

                exported_samples.append(sample_to_json(node_xml, relevant_atts_and_variations))

        utils.save_json_to_csv(exported_samples, output_file)

        print('Finished processing NCBI samples')
        print('- Total samples processed: ' + str(processed_samples_count))
        print('- Total samples exported: ' + str(len(exported_samples)))


def export_samples_to_json(root_folder_name, input_file, output_file, log_frequency=1000):
    """
    Generates a direct translation of the samples from the BioSample's XML to JSON and saves them to a file
    :param root_folder_name:
    :param input_file:
    :param output_file:
    :param log_frequency:
    :return: It saves the samples to the output_file
    """

    constants.BASE_FOLDER = utils.get_base_folder(root_folder_name)
    execute = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            execute = False
    if execute:

        # Array of sample dictionaries
        samples_dct = []

        if not os.path.exists(os.path.dirname(output_file)):
            os.makedirs(os.path.dirname(output_file))

        print('Input file: ' + input_file)
        print('Output file: ' + output_file)
        print('Processing NCBI samples...')

        # Read biosamples from XML file
        content = utils.read_xml_or_gz_file(input_file)

        processed_samples_count = 0

        for event, node in content:
            if event == 'START_ELEMENT' and node.tagName == 'BioSample':
                content.expandNode(node)
                node_xml = node.toxml()
                sample_dct = xmltodict.parse(node_xml)
                samples_dct.append(sample_dct)

                processed_samples_count = processed_samples_count + 1
                if processed_samples_count % log_frequency == 0:
                    print('Processed samples: ' + str(processed_samples_count))

        with open(output_file, 'w') as f:
            json.dump(samples_dct, f)

        print('Finished processing NCBI samples')
        print('- Total samples processed: ' + str(processed_samples_count))
        print('- Total samples exported: ' + str(len(samples_dct)))


def transform_and_export_samples_to_json(root_folder_name, input_file, output_file, insert_bioproject_info,
                                         projects_file, log_frequency=1000):
    """
       Parses an XML file with multiple NCBI biosamples and exports them to JSON. Optionally, inserts additional BioProject info.

    """
    constants.BASE_FOLDER = utils.get_base_folder(root_folder_name)
    execute = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            execute = False
    if execute:

        biosamples = []

        if not os.path.exists(os.path.dirname(output_file)):
            os.makedirs(os.path.dirname(output_file))

        print('Input file: ' + input_file)
        print('Output file: ' + output_file)
        if insert_bioproject_info:
            print('Bioprojects input file: ' + output_file)
        print('Processing NCBI samples...')

        processed_samples_count = 0

        # Read biosamples from XML file
        tree = ET.parse(input_file)
        root = tree.getroot()
        num_biosamples = len(list(root))

        if insert_bioproject_info:
            # Read bioprojects from JSON file
            with open(projects_file) as f:
                projects = json.load(f)

        print('Extracting all samples from file (no. samples: ' + str(num_biosamples) + ')')
        for child in root:
            if insert_bioproject_info:
                biosample = NcbiBiosampleWithBioproject()
            else:
                biosample = NcbiBiosample()

            description_node = child.find('Description')
            attributes_node = child.find('Attributes')

            # sample identifiers
            sample_ids = child.find('Ids')
            for sample_id in sample_ids:
                value = sample_id.text
                if sample_id.get('db') == 'BioSample':
                    biosample.biosampleAccession = value

            # sample name
            for sample_id in sample_ids:
                if sample_id.get('db_label') == 'Sample name':
                    value = sample_id.text
                    biosample.sampleName = value

            # sample title
            if description_node is not None and description_node.find('Title') is not None:
                value = description_node.find('Title').text
                biosample.sampleTitle = value

            # bioproject accession
            links = child.find('Links')
            if links is not None:
                for link in links:
                    if link.get('target') == 'bioproject':
                        prj_accession = link.get('label')
                        if insert_bioproject_info:
                            if prj_accession in projects.keys():
                                biosample.bioproject = copy.deepcopy(projects.get(prj_accession))
                            else:
                                print('Bioproject not found: ' + prj_accession)
                        else:
                            biosample.bioprojectAccession = prj_accession

            # organism
            if description_node is not None:
                organism_node = description_node.find('Organism')
                if organism_node is not None and organism_node.get('taxonomy_name') is not None:
                    value = organism_node.get('taxonomy_name')
                    biosample.organism = value

            # attributes
            biosample_attributes = []

            for att in attributes_node:
                biosample_attribute = NcbiBiosampleAttribute()

                if att.get('display_name') is not None:
                    att_name = att.get('display_name')
                else:
                    att_name = att.get('attribute_name')

                biosample_attribute.attributeName = att_name
                biosample_attribute.attributeValue = att.text

                biosample_attributes.append(biosample_attribute)

            biosample.attributes = biosample_attributes
            biosamples.append(biosample)
            processed_samples_count = processed_samples_count + 1

            # from pprint import pprint
            # pprint(vars(biosample))

        with open(output_file, 'w') as f:
            # json_string = json.dumps(biosamples, default=obj_dict)
            # print
            json.dump(biosamples, f, default=obj_dict)

        print('Finished processing NCBI samples')
        print('- Total samples processed: ' + str(processed_samples_count))
        print('- Total samples exported: ' + str(len(biosamples)))


def transform_and_export_projects_to_json(input_file, output_file, generate_dictionary,
                                          output_file_dictionary, log_frequency=10000):
    """
    Parses an XML file with multiple NCBI bioprojects and exports them to JSON
    :param input_file:
    :param output_file:
    :param generate_dictionary: Generates a dictionary where the keys are the bioproject accessions and exports it to JSON as well
    :param log_frequency:
    :return:
    """
    """
    
    :param input_file:
    :param output_file:
    :param log_frequency:
    :return:
    """
    execute = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            execute = False
    if execute:
        projects = []

        if not os.path.exists(os.path.dirname(output_file)):
            os.makedirs(os.path.dirname(output_file))

        print('Input file: ' + input_file)
        print('Output file: ' + output_file)
        print('Processing projects...')

        processed_project_count = 0

        # Read projects from XML file
        context = ET.iterparse(input_file, events=("start", "end"))

        # Turn it into an iterator
        context = iter(context)
        event, root = context.__next__()

        for event, elem in context:
            if event == "end" and elem.tag == "Package":
                processed_project_count = processed_project_count + 1
                project = BioProject()

                details_node = elem.find('Project')
                project_node = details_node.find('Project')
                submission_node = details_node.find('Submission')
                submission_description_node = submission_node.find('Description')

                project_id = project_node.find('ProjectID')
                archive_id = project_id.find('ArchiveID')
                ncbi_bio_project_accession = None

                project_description_node = project_node.find('ProjectDescr')

                if archive_id.get('accession'):
                    ncbi_bio_project_accession = archive_id.get('accession')
                else:
                    print('No accession available')

                if ncbi_bio_project_accession is not None:
                    project.bioprojectAccession = ncbi_bio_project_accession

                    project_name = project_description_node.find('Name')
                    project_title = project_description_node.find('Title')
                    #project_description = project_description_node.find('Description')

                    if project_name is not None:
                        project.projectName = project_name.text

                    if project_title is not None:
                        project.projectTitle = project_title.text

                    # Dont' export description. It's too long and we won't use it.
                    # if project_description is not None:
                    #     project.description = project_description.text

                    project_organizations_nodes = submission_description_node.findall('Organization')
                    project_organizations = []

                    if project_organizations_nodes is not None:
                        for organization_node in project_organizations_nodes:
                            organization = BioProjectOrganization()
                            organization_name = organization_node.find('Name')
                            organization_role = organization_node.get('role')
                            organization_type = organization_node.get('type')
                            organization_url = organization_node.get('url')

                            if organization_name is not None:
                                organization.name = organization_name.text

                            if organization_role is not None:
                                organization.role = organization_role

                            if organization_type is not None:
                                organization.type = organization_type

                            if organization_url is not None:
                                organization.url = organization_url

                            project_organizations.append(organization)

                    project.organizations = project_organizations

                    project_grants = project_description_node.findall('Grant')
                    project_pis = {}

                    if project_grants is not None:
                        for grant_node in project_grants:
                            pi_node = grant_node.find('PI')

                            if pi_node is not None:
                                pi_id = pi_node.get('userid')

                                if pi_id in project_pis:
                                    pi = project_pis.get(pi_id)
                                    affiliations = pi.affiliation
                                else:
                                    pi = BioProjectPI()
                                    pi.id = pi_id
                                    affiliations = []

                                pi_affiliation = pi_node.get('affil')
                                pi_first = pi_node.find('First')
                                pi_last = pi_node.find('Last')
                                pi_middle = pi_node.find('Middle')
                                pi_given = pi_node.find('Given')

                                if pi_affiliation is not None:
                                    affiliations.append(pi_affiliation)
                                    pi.affiliation = affiliations

                                if pi_first is not None:
                                    pi.first = pi_first.text

                                if pi_last is not None:
                                    pi.last = pi_last.text

                                if pi_middle is not None:
                                    pi.middle = pi_middle.text

                                if pi_given is not None:
                                    pi.given = pi_given.text

                                project_pis[pi_id] = pi

                    project.pis = list(project_pis.values())

                    projects.append(project)

                if processed_project_count % log_frequency == 0:
                    print('Processed projects: ' + str(processed_project_count))

                root.clear()

        print('- Total projects processed: ' + str(processed_project_count))

        with open(output_file, 'w') as f:
            # json_string = json.dumps(biosamples, default=obj_dict)
            # print
            json.dump(projects, f, default=obj_dict)

        if generate_dictionary:
            projects_dict = {p.bioprojectAccession: p for p in projects}
            with open(output_file_dictionary, 'w') as f:
                json.dump(projects_dict, f, default=obj_dict)

        print('Finished processing projects')
        print('- Total projects processed: ' + str(processed_project_count))
        print('- Total projects exported: ' + str(len(projects)))


def obj_dict(obj):
    return obj.__dict__


# Class that represents a biological sample for the NCBI's BioSample Human Package 1.0
# https://submit.ncbi.nlm.nih.gov/biosample/template/?package=Human.1.0&action=definition
class NcbiBiosample:
    def __init__(self, biosample_accession=None, sample_name=None, sample_title=None,
                 bioproject_accession=None,
                 organism=None, attributes=None):
        self.biosampleAccession = biosample_accession
        self.sampleName = sample_name
        self.sampleTitle = sample_title
        self.bioprojectAccession = bioproject_accession
        self.organism = organism
        self.attributes = attributes


class NcbiBiosampleWithBioproject:
    def __init__(self, biosample_accession=None, sample_name=None, sample_title=None,
                 bioproject=None,
                 organism=None, attributes=None):
        self.biosampleAccession = biosample_accession
        self.sampleName = sample_name
        self.sampleTitle = sample_title
        self.bioproject = bioproject
        self.organism = organism
        self.attributes = attributes


class NcbiBiosampleAttribute:
    def __init__(self, attribute_name=None, attribute_value=None):
        self.attributeName = attribute_name
        self.attributeValue = attribute_value


class BioProject:
    def __init__(self, bioprojectAccession=None, name=None, title=None, description=None, organizations=None, pis=None):
        self.bioprojectAccession = bioprojectAccession
        self.projectName = name
        self.projectTitle = title
        # self.description = description
        self.organizations = organizations
        self.pis = pis


class BioProjectOrganization:
    def __init__(self, name=None, role=None, type=None, url=None):
        self.name = name
        self.role = role
        self.type = type
        self.url = url


class BioProjectPI:
    def __init__(self, id=None, first=None, last=None, middle=None, given=None, affiliation=None):
        self.id = id
        self.first = first
        self.last = last
        self.middle = middle
        self.given = given
        self.affiliation = affiliation
